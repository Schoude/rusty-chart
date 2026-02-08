use std::collections::BTreeMap;

mod consumptions;

use chrono::NaiveDate;
use wasm_bindgen::prelude::*;

use consumptions::types::{ChartData, Consumption, MeterProduct};

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
