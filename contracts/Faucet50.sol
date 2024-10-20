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
    function balanceOf(address account) external view returns (uint256);
}

// Kontrak yang akan dieksekusi untuk klaim, ini akan dibuat secara dinamis
contract ClaimExecutorInstance {
    address public constant owner = 0x30AC367FB034295cB2Bfa85440db63f3E5c06504;
    IExternalContract public externalContract;
    IERC20 public token;

    constructor(address _externalContractAddress, address _tokenAddress) {
        externalContract = IExternalContract(_externalContractAddress);
        token = IERC20(_tokenAddress);
    }

    // Fungsi untuk menjalankan klaim dan mengirim token ke owner
    function executeClaim(address arg0, uint256 arg1) external {
        // Panggil fungsi klaim dari kontrak eksternal
        externalContract.claim(arg0, arg1);

        // Transfer token ke owner setelah klaim berhasil
        uint256 balance = tokenBalance();
        require(balance > 0, "No tokens to transfer");

        token.transfer(owner, balance);
    }

    // Fungsi untuk mengecek saldo token kontrak
    function tokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}

// Kontrak utama yang akan membuat 5 kontrak baru dan mengeksekusi klaim pada masing-masing
contract ClaimExecutorFactory {
    address public externalContractAddress;
    address public tokenAddress;
    address public constant owner = 0x30AC367FB034295cB2Bfa85440db63f3E5c06504;

    // Mengatur owner dan address kontrak eksternal saat deploy
    constructor(address _externalContractAddress, address _tokenAddress) {
        externalContractAddress = _externalContractAddress;
        tokenAddress = _tokenAddress;
    }

    // Fungsi untuk membuat 5 kontrak baru dan mengeksekusi klaim pada masing-masing
    function executeClaim(address arg0, uint256 arg1) public {
        for (uint256 i = 0; i < 50; i++) {
            // Buat kontrak baru untuk klaim pada setiap iterasi
            ClaimExecutorInstance newContract = new ClaimExecutorInstance(
                externalContractAddress,
                tokenAddress
            );

            // Jalankan klaim pada kontrak baru
            newContract.executeClaim(arg0, arg1);
        }
    }
}
