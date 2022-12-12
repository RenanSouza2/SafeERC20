// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

library LibSafeERC20 {
    function safeTokenTransfer(address token, address to, uint amount) internal {
        bytes memory data = abi.encodeWithSelector(0xA9059CBB, to, amount);
        bool done;
        assembly {
            let success := call(gas(), token, 0, add(data, 0x20), 0x44, 0x00, 0x20)
            let res := mload(0x00)
            done := and(success, res)
        }
        require(done, 'Token transfer not successfull');
    }

    function safeTokenTransferFrom(
        address token, 
        address owner,
        address to,
        uint amount
    ) internal {
        bytes memory data = abi.encodeWithSelector(0x23B872DD, owner, to, amount);
        bool done;
        assembly {
            let success := call(gas(), token, 0, add(data, 0x20), 0x64, 0x00, 0x20)
            let res := mload(0x00)
            done := and(success, res)
        }
        require(done, 'Token transferFrom not successfull');
    }
}
