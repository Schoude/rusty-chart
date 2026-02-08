use async_trait::async_trait;
use serde::Deserialize;

use crate::{api::CarApi, chart::types::ChartPoint};

// Conversion constants
const GALLONS_TO_LITERS: f32 = 3.78541;
const MILES_TO_KM: f32 = 1.60934;

#[derive(Deserialize)]
struct CarApiResponse {
    data: Vec<CarData>,
}

#[derive(Deserialize)]
struct CarData {
    pub fuel_tank_capacity: Option<String>,
    pub range_highway: Option<f32>,
}

pub struct HttpCarApi;

#[async_trait(?Send)]
impl CarApi for HttpCarApi {
    async fn fetch_single_make(&self, origin: &str, make: &str) -> Result<Vec<ChartPoint>, String> {
        let url = format!(
            "{}/api-proxy/api/mileages/v2?limit=1000&make={}",
            origin, make
        );

        let cars: CarApiResponse = reqwest::get(url)
            .await
            .map_err(|e| format!("HTTP request failed: {}", e))?
            .json()
            .await
            .map_err(|e| format!("Failed to parse JSON: {}", e))?;

        let points = cars
            .data
            .iter()
            .filter_map(|car| {
                if let (Some(fuel), Some(range)) = (&car.fuel_tank_capacity, car.range_highway) {
                    fuel.parse::<f32>().ok().and_then(|f| {
                        if f > 0.0 && range > 0.0 {
                            Some(ChartPoint {
                                x: (f * GALLONS_TO_LITERS).round(),
                                y: (range * MILES_TO_KM).round(),
                            })
                        } else {
                            None
                        }
                    })
                } else {
                    None
                }
            })
            .collect();

        Ok(points)
    }
}
