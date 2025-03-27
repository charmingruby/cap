// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FeatureDatabase {
    struct Feature {
        string title;
        string description;
        string status;
        uint8 priority;
        uint32 expiresAt;
    }

    mapping(uint32 => Feature) public features;

    uint256 private amount = 0;
    uint32 private nextId = 0;
    address private immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function getAmount() public view returns (uint256) {
        return amount;
    }

    function store(Feature memory feat) public {
        nextId++;
        features[nextId] = feat;
        amount++;
    }

    function save(uint32 id, Feature memory feat) public {
        Feature memory featureFound = features[id];

        require(!compareStr(featureFound.title, ""), "Feature does not exist");

        if (
            !compareStr(featureFound.title, feat.title) &&
            !compareStr(feat.title, "")
        ) features[id].title = feat.title;

        if (
            !compareStr(featureFound.description, feat.description) &&
            !compareStr(feat.description, "")
        ) features[id].description = feat.description;

        if (
            !compareStr(featureFound.status, feat.status) &&
            !compareStr(feat.status, "")
        ) features[id].status = feat.status;

        if (featureFound.priority != feat.priority)
            features[id].priority = feat.priority;

        if (featureFound.expiresAt != feat.expiresAt)
            features[id].expiresAt = feat.expiresAt;
    }

    function remove(uint32 id) public restricted {
        require(!compareStr(features[id].title, ""), "Feature does not exist");

        delete features[id];
        amount--;
    }

    modifier restricted() {
        require(owner == msg.sender, "Only the owner can remove features");
        _;
    }

    function compareStr(
        string memory str1,
        string memory str2
    ) private pure returns (bool) {
        bytes memory arrA = bytes(str1);
        bytes memory arrB = bytes(str2);

        return
            (arrA.length == arrB.length) &&
            (keccak256(abi.encodePacked(str1)) ==
                keccak256(abi.encodePacked(str2)));
    }
}
