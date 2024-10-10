// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface untuk kontrak eksternal yang memiliki fungsi claim
interface IExternalContract {
    function claim(address arg0, uint256 arg1) external;
}

// Interface untuk ERC20 token agar bisa transfer token dan cek saldo
interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256); // Tambahkan ini
}

contract ClaimExecutor {
    address public externalContractAddress;
    address public tokenAddress;
    address public owner;

    // Mengatur owner dan address kontrak eksternal saat deploy
    constructor(address _externalContractAddress, address _tokenAddress) {
        externalContractAddress = _externalContractAddress;
        tokenAddress = _tokenAddress;
        owner = msg.sender;
    }

    // Fungsi untuk memanggil claim di kontrak eksternal dan mengirim token ke owner
    function executeClaim(address arg0, uint256 arg1) public {
        // Panggil fungsi claim dari kontrak eksternal
        IExternalContract externalContract = IExternalContract(
            externalContractAddress
        );
        externalContract.claim(arg0, arg1);

        // Setelah claim berhasil, transfer token ke owner
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = tokenBalance();
        require(balance > 0, "No tokens to transfer");

        // Transfer token dari kontrak ini ke owner
        token.transfer(owner, balance);
    }

    // Fungsi untuk memeriksa saldo token kontrak
    function tokenBalance() public view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this)); // Menggunakan balanceOf untuk mengecek saldo
    }
}
