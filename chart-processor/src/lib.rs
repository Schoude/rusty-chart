use std::collections::HashMap;

mod api;
mod chart;

use wasm_bindgen::prelude::*;

use crate::api::fetch::fetch_single_make;
use crate::chart::types::ChartConfig;

#[wasm_bindgen]
pub async fn get_chart_data(makes: Vec<String>) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let window = web_sys::window().ok_or("no global `window` exists")?;
    let location = window.location();
    let origin = location.origin().map_err(|_| "could not get origin")?;

    let tasks = makes.iter().map(|make| {
        let m = make.clone();
        let org = origin.clone();
        async move { (m.clone(), fetch_single_make(&org, &m).await) }
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
