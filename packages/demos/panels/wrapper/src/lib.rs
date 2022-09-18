pub mod wrap;
use imageproc::drawing::draw_text_mut;
use rusttype::{Font, Scale};
pub use wrap::*;
use polywrap_wasm_rs::BigInt;
use serde::{Serialize, Deserialize};
use std::{vec};
use wrap::imported::ethereum_module;

use image::{io::Reader as ImageReader, DynamicImage, ImageOutputFormat};
use std::io::Cursor;

const PANELS_CONTRACT_ADDRESS: &'static str = "0x1fE944eca408d1517a28DafE48194cab87E4b2b5";
pub struct PanelText {
    text: String,
    x: i32,
    y: i32,
}

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

pub fn metadata(args: ArgsMetadata) -> Option<WrapLinkJson> {
    let metadata = Metadata {
        name: "Panel ".to_string() + &args.id.to_string(),
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

pub fn generate_image(args: &ArgsImage) -> Option<Vec<u8>> {
    let texts = fetch_texts(args.id.to_string());

    let img = draw(&texts);

    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    Some(image_data)
}
pub fn fetch(id: String) -> String {
    let res = EthereumModule::call_contract_view(&ethereum_module::ArgsCallContractView {
        address: PANELS_CONTRACT_ADDRESS.to_string(),
        method: "function enumerateTextsForPanel(uint tokenId, uint256 start, uint256 count) view returns ((string text, uint256 x, uint256 y)[] memory texts, uint256 total)".to_string(),
        args: Some(
            vec![
                id,
                "0".to_string(),
                "100".to_string(),
            ]
        ),
        connection: Some(EthereumConnection {
            network_name_or_chain_id: Some("polygon".to_string()),
            node: None
        }),
    });

    match res {
        Ok(result) => {
            result
        },
        Err(e) => {
            e
        }
    }
}

pub fn fetch_texts(id: String) -> Vec<PanelText> {
    let res = EthereumModule::call_contract_view(&ethereum_module::ArgsCallContractView {
        address: PANELS_CONTRACT_ADDRESS.to_string(),
        method: "function enumerateTextsForPanel(uint tokenId, uint256 start, uint256 count) view returns ((string text, uint256 x, uint256 y)[] memory texts, uint256 total)".to_string(),
        args: Some(
            vec![
                id,
                "0".to_string(),
                "100".to_string(),
            ]
        ),
        connection: Some(EthereumConnection {
            network_name_or_chain_id: Some("polygon".to_string()),
            node: None
        }),
    });

    match res {
        Ok(result) => {
            get_texts_from_string(result)
        },
        Err(_) => {
            vec![]
        }
    }
}

fn get_texts_from_string(result: String) -> Vec<PanelText> {
    let text_strs: Vec<&str> = result.split(",").collect();

    if text_strs.len() > 0 {
        let mut texts: Vec<PanelText> = Vec::new();
        let mut i = 0;
        let total = text_strs[text_strs.len() - 1].parse().unwrap();
        for text in 0..total {
            let text = text_strs[i].clone();
            let x = text_strs[i + 1].parse().unwrap();
            let y = text_strs[i + 2].parse().unwrap();
            texts.push(PanelText {
                text: text.to_string(),
                x,
                y,
            });
            i += 3;
        }
        texts
    } else {
        vec![]
    }
}

pub fn draw(texts: &Vec<PanelText>) -> DynamicImage {
    let mut img = ImageReader::new(Cursor::new(include_bytes!("panel.jpg")))
        .with_guessed_format()
        .unwrap()
        .decode()
        .unwrap();

    let font = Vec::from(include_bytes!("font.ttf") as &[u8]);
    let font = Font::try_from_vec(font).unwrap();

    let font_size = 50.0;
    let scale = Scale {
        x: font_size,
        y: font_size,
    };

    for text in texts {
        draw_text_mut(
            &mut img, 
            image::Rgba([0u8, 0u8, 0u8, 255u8]), 
            text.x,
            text.y,
            scale, 
            &font, 
            &text.text
     );
    }

    img
}


#[cfg(test)]
mod tests {
    use crate::{draw, PanelText, get_texts_from_string};

    #[test]
    fn test() {
        let img = draw(&vec![
            PanelText {
                text: "Panel 1".to_string(),
                x: 100,
                y: 100,
            },
            PanelText {
                text: "Halloooooo".to_string(),
                x: 100,
                y: 200,
            },
        ]);

        img.save("image.png").unwrap();
    }

    #[test]
    fn test2() {
        let img = draw(&get_texts_from_string("Lol,100,100,Hello,100,200,World,100,300,3".to_string()));

        img.save("image2.png").unwrap();
    }
}