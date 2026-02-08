use std::collections::{BTreeMap, HashMap};

mod api;
mod chart;

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use api::{CarApi, http::HttpCarApi};
use chart::types::ChartConfig;

#[wasm_bindgen]
pub async fn get_chart_data(makes: Vec<String>) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let window = web_sys::window().ok_or("no global `window` exists")?;
    let location = window.location();
    let origin = location.origin().map_err(|_| "could not get origin")?;

    let tasks = makes.iter().map(|make| {
        let m = make.clone();
        let org = origin.clone();
        async move { (m.clone(), HttpCarApi.fetch_single_make(&org, &m).await) }
    });

    let results = futures::future::join_all(tasks).await;

    let mut categorized_data = HashMap::new();
    for (make_name, res) in results {
        match res {
            Ok(cars) => {
                categorized_data.insert(make_name, cars);
            }
            Err(e) => return Err(JsValue::from_str(&e)),
        }
    }

    let config = ChartConfig {
        title: "Range by Fuel Tank Capacity".to_string(),
        data: categorized_data,
    };

    Ok(serde_wasm_bindgen::to_value(&config)?)
}

// For monthly consumption chart.
#[derive(Debug, PartialEq, Deserialize)]
#[serde(rename_all = "camelCase")]
enum MeterProduct {
    Electricity,
    Gas,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Consumption {
    quantity: f64,
    start: String,
    meter_product: MeterProduct,
}

#[derive(Debug, Serialize)]
struct ChartData {
    month: String,
    total: f64,
}

#[wasm_bindgen]
pub async fn get_consumption_chart(
    val: JsValue,
    filter_product: Option<String>,
) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let consumptions: Vec<Consumption> = serde_wasm_bindgen::from_value(val)
        .map_err(|e| JsValue::from_str(&format!("Failed to parse input JSON: {}", e)))?;

    let target_product: Option<MeterProduct> = if let Some(product_str) = filter_product {
        Some(
            serde_json::from_str(&format!("\"{}\"", product_str))
                .map_err(|e| JsValue::from_str(&format!("Invalid meter product: {}", e)))?,
        )
    } else {
        None
    };

    let mut monthly_totals: BTreeMap<String, f64> = BTreeMap::new();

    for consumption in consumptions {
        let should_include = match target_product {
            Some(ref target) => &consumption.meter_product == target,
            None => true,
        };
        if !should_include {
            continue;
        }
        if let Ok(date) = NaiveDate::parse_from_str(&consumption.start, "%Y-%m-%d") {
            let month = date.format("%Y-%m").to_string();
            *monthly_totals.entry(month).or_insert(0.0) += consumption.quantity;
        }
    }

    let output: Vec<ChartData> = monthly_totals
        .into_iter()
        .map(|(month, total)| ChartData { month, total })
        .collect();

    Ok(serde_wasm_bindgen::to_value(&output)?)
}
