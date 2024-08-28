mod utils;

use std::convert::TryInto;

use phantom_zone::{set_common_reference_seed, set_parameter_set, ParameterSelector};

use js_sys::Uint8Array;
use wasm_bindgen::prelude::*;

pub type Seed = [u8; 32];
pub const PARAMETER: ParameterSelector = ParameterSelector::NonInteractiveLTE4Party;

fn vec_to_array<T, const N: usize>(v: Vec<T>) -> [T; N] {
    v.try_into()
        .unwrap_or_else(|v: Vec<T>| panic!("Expected a Vec of length {} but it was {}", N, v.len()))
}

#[wasm_bindgen]
pub fn setup(seed: &Uint8Array) {
    set_parameter_set(PARAMETER);
    let seed_vec = seed.to_vec();
    let seed = vec_to_array::<u8, 32>(seed_vec);
    set_common_reference_seed(seed);
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
