use async_trait::async_trait;

use crate::chart::types::ChartPoint;

#[async_trait(?Send)]
pub trait CarApi {
    async fn fetch_single_make(&self, origin: &str, make: &str) -> Result<Vec<ChartPoint>, String>;
}

pub mod http;
