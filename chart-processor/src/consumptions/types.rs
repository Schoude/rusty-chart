use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum MeterProduct {
    Electricity,
    Gas,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Consumption {
    pub quantity: f64,
    pub start: String,
    pub meter_product: MeterProduct,
}

#[derive(Debug, Serialize)]
pub struct ChartData {
    pub month: String,
    pub total: f64,
}
