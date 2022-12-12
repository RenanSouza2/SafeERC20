// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { LibSafeERC20 } from './SafeERC20.sol';

contract MockERC20 {
    address public owner;
    address public to;
    uint public amount;

    bool public fail;
    bool public revert_;

    function setFail(bool _fail)
    external {
        fail = _fail;
    }

    function setRevert(bool _revert)
    external {
        revert_ = _revert;
    }

    function transfer(address _to, uint _amount)
    external returns (bool) {
        if(fail) return false;
        if(revert_) revert();

        to = _to;
        amount = _amount;
        return true;
    }

    function transferFrom(address _owner, address _to, uint _amount)
    external returns (bool) {
        if(fail) return false;
        if(revert_) revert();

        owner = _owner;
        to = _to;
        amount = _amount;
        return true;
    }
}

contract LibUser {
    using LibSafeERC20 for address;

    function transfer(address token, address to, uint amount)
    external {
        token.safeTokenTransfer(to, amount);
    }

    function transferFrom(
        address token, 
        address owner, 
        address to, 
        uint amount
    ) external {
        token.safeTokenTransferFrom(owner, to, amount);
    }
}