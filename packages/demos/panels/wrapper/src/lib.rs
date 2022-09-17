pub mod wrap;
pub use wrap::*;
use polywrap_wasm_rs::BigInt;
use serde::{Serialize, Deserialize};
use std::{vec};

#[derive(Serialize, Deserialize, Debug)]
struct Metadata {
    name: String,
    description: String,
    external_url: String,
    image: String,
    attributes: Vec<MetadataStringAttribute>,
}

#[derive(Serialize, Deserialize, Debug)]
struct MetadataStringAttribute {
    trait_type: String, 
    value: String
}

fn to_u64(int: &BigInt) -> u64 {
    let result = int.to_u64_digits().1;

    result.last().unwrap().clone()
}

pub fn metadata(args: ArgsMetadata) -> Option<WrapLinkJson> {
    let id = to_u64(&args.id);

    let metadata = Metadata {
        name: "Panel ".to_string() + &id.to_string(),
        description: "ETHBerlin 2022 Panel NFTs".to_string(),
        external_url: "https://wrap.link/i/ens/eth-berlin-2022-panels.eth/index".to_string(),
        image: "https://wrap.link/i/ens/eth-berlin-2022-panels.eth/image?id=".to_string() + &args.id.to_string(),
        attributes: vec![]
    };

    Some(
        WrapLinkJson {
            _wrap_link_type: "json".to_string(),
            content: serde_json::to_string(&metadata).unwrap(),
        }
    )
}

pub fn image(args: ArgsImage) -> Option<WrapLinkFile> {
    let panel_image = generate_image(&args);

    match panel_image {
        Some(image) => Some(
            WrapLinkFile {
                _wrap_link_type: "file".to_string(),
                content: image,
                content_type: "image/png".to_string(),
            }
        ),
        None => None,
    }
}

pub fn generate_image(_: &ArgsImage) -> Option<Vec<u8>> {
    Some(vec![])
}
