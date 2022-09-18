// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./common/BaseERC721.sol";

contract ETHBerlin2022Panel is BaseERC721 {
    struct PanelText {
        string text;
        uint x;
        uint y;
    }
    mapping(uint256 => PanelText[]) public panelTexts;

    constructor(
        address _owner, 
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) BaseERC721(_owner, _name, _symbol, _baseURI) {
        for (uint i = 0; i < 10; i++) {
            _mintTo(_owner);
        }
    }

    function paint(uint tokenId, string memory text, uint x, uint y) public {
        PanelText[] storage textsForPanel = panelTexts[tokenId];
        textsForPanel.push(PanelText(text, x, y));
    }

    function enumerateTextsForPanel(uint tokenId, uint256 start, uint256 count) public view returns(PanelText[] memory texts, uint256 total)  {
        PanelText[] storage textsForPanel = panelTexts[tokenId];
        uint256 length = textsForPanel.length;
        if(start + count > length) {
            count = length - start;
        }
        
        texts = new PanelText[](count);

        for(uint256 i = 0; i < count; i++) {
            texts[i] = textsForPanel[start + i];
        }

        return (texts, length);
    }
}
