mod utils;

use itertools::Itertools;
use std::convert::TryInto;

use js_sys::{BigUint64Array, Uint8Array};
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::Serializer;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

use phantom_zone::*;
use phantom_zone::{
    evaluator::NonInteractiveMultiPartyCrs,
    keys::CommonReferenceSeededNonInteractiveMultiPartyServerKeyShare, parameters::BoolParameters,
};

pub type Seed = [u8; 32];
pub type ServerKeyShare = CommonReferenceSeededNonInteractiveMultiPartyServerKeyShare<
    Vec<Vec<u64>>,
    BoolParameters<u64>,
    NonInteractiveMultiPartyCrs<Seed>,
>;
pub const PARAMETER: ParameterSelector = ParameterSelector::NonInteractiveLTE4Party;

fn vec_to_array<T, const N: usize>(v: Vec<T>) -> [T; N] {
    v.try_into()
        .unwrap_or_else(|v: Vec<T>| panic!("Expected a Vec of length {} but it was {}", N, v.len()))
}

#[wasm_bindgen]
pub fn init(seed: &Uint8Array) {
    set_parameter_set(PARAMETER);
    let seed_vec = seed.to_vec();
    let seed = vec_to_array::<u8, 32>(seed_vec);
    set_common_reference_seed(seed);
}

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct PZClient {
    client_key: ClientKey,
    server_key_share: ServerKeyShare,
    circuit_output: Option<Vec<FheBool>>,
}

#[wasm_bindgen]
impl PZClient {
    #[wasm_bindgen(constructor)]
    pub fn new(user_id: usize, total_users: usize) -> PZClient {
        let client_key = gen_client_key();
        let server_key_share = gen_server_key_share(user_id, total_users, &client_key);

        PZClient {
            client_key,
            server_key_share,
            circuit_output: None,
        }
    }

    // for input, we represent the Vec<bool> as an Uint8Array, each bool would be an u8
    // in rust, Vec<bool> have the same layout as Vec<u8> anyway
    pub fn encrypt(&self, input: &Uint8Array) -> JsValue {
        let input = input.to_vec().into_iter().map(|u| u != 0).collect_vec();
        let s = Serializer::new().serialize_large_number_types_as_bigints(true);
        self.client_key
            .encrypt(input.as_slice())
            .serialize(&s)
            .unwrap()
    }

    // circuit_output should be Vec<FheBool>
    pub fn set_circuit_output(&mut self, circuit_output: JsValue) {
        self.circuit_output = Some(serde_wasm_bindgen::from_value(circuit_output).unwrap());
    }

    pub fn gen_decryption_share(&self) -> BigUint64Array {
        assert!(
            self.circuit_output.is_some(),
            "should call set_circuit_output first"
        );

        self.circuit_output
            .as_ref()
            .unwrap()
            .iter()
            .map(|c_bit| self.client_key.gen_decryption_share(c_bit))
            .collect_vec()
            .as_slice()
            .into()
    }

    pub fn decrypt(&self, shares: Vec<BigUint64Array>) -> Uint8Array {
        assert!(
            self.circuit_output.is_some(),
            "should call set_circuit_output first"
        );

        self.circuit_output
            .as_ref()
            .unwrap()
            .iter()
            .enumerate()
            .map(|(i, bit)| {
                let shares_for_ith_bit = shares
                    .iter()
                    .map(|user_share| user_share.get_index(i as u32))
                    .collect_vec();
                self.client_key
                    .aggregate_decryption_shares(bit, &shares_for_ith_bit) as u8
            })
            .collect_vec()
            .as_slice()
            .into()
    }
}
