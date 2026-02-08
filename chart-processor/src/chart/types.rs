use std::collections::HashMap;
use serde::{Deserialize, Serialize};

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
