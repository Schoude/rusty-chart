use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
pub struct ChartPoint {
    pub x: f32,
    pub y: f32,
}

#[derive(Serialize)]
pub struct ChartConfig {
    pub title: String,
    pub data: HashMap<String, Vec<ChartPoint>>,
}
