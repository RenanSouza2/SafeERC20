// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

interface IERC20 {
    function decimals()
    external view returns (uint8);

    function allowance(address owner, address spender)
    external view returns (uint);

    function approve(address spender, uint amount)
    external returns (bool);
}

library LibSafeERC20 {
    function safeTokenTransfer(address token, address to, uint amount) internal {
        bytes memory data = abi.encodeWithSelector(0xA9059CBB, to, amount);
        bool done;
        assembly {
            let success := call(gas(), token, 0, add(data, 0x20), 0x44, 0x00, 0x20)
            let res := mload(0x00)
            done := and(success, res)
        }
        require(done, 'Token transfer not successful');
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
        require(done, 'Token transferFrom not successful');
    }

    function safeDecimals(address token)
    internal view returns (uint8) {
        try IERC20(token).decimals() returns (uint8 decimals) {
            return decimals;
        } catch  {
            return 0;
        }
    }

    function increaseAllowance(
        address token,
        address spender,
        uint amount
    ) internal {
        uint allowance = IERC20(token).allowance(address(this), spender);
        try IERC20(token).approve(spender, allowance + amount) returns (bool success) {
            return;
        } catch {
            revert('Approve opearion not successful');
        }
    }

    function decreaseAllowance(
        address token,
        address spender,
        uint amount
    ) internal {
        uint allowance = IERC20(token).allowance(address(this), spender);
        try IERC20(token).approve(spender, allowance - amount) returns (bool success) {
            return;
        } catch {
            revert('Approve opearion not successful');
        }
    }
}
