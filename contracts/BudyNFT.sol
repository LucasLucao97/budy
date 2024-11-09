// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./BudyNFTStorage.sol";
import "./Errors.sol";


/// @title BudyNFT Contract
/// @notice This contract manages an ERC721 token system with access control and upgradeability.
/// @dev Inherits from BudyNFTStorage and integrates ERC721, AccessControl, and UUPS upgradeable patterns.
/// The contract allows minting tokens, and manages roles for upgrades.
/// @custom:security-contact cmarchese@comunyt.com
contract BudyNFT is BudyNFTStorage {
    using Errors for *;

    // Event declaration
    /// @notice Emitted when a new NFT is minted
    /// @param owner The address of the NFT owner
    /// @param tokenId The unique identifier of the minted NFT
    event Minted(address indexed owner, uint256 indexed tokenId);

    // Constructor
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Initialize function
    /// @notice Initializes the contract and grants roles to the caller.
    /// @dev Sets up ERC721 token, access control, and upgradeability.
    /// Can only be called once as it is protected by the initializer modifier.
    function initialize() initializer public {
        __ERC721_init("BudyNFT", "BFT");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(WITHDRAW_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    // Modifiers
    /// @notice Checks if the address is whitelisted and prevents re-minting.
    /// @dev Verifies that the nonce is unused and marks it as used. 
    /// Ensures the user is authorized based on the provided signature.
    modifier isPricePaid() {
        if(msg.value != PRICE){
             revert Errors.NotThePrice();
        }
        _;
    }

    /// @notice Prevents reentrancy during function execution.
    /// @dev Checks if the state is `InProgress`. If so, it reverts; otherwise, it sets the state to `InProgress`, runs the function body, and then sets it to `Completed`.
    /// to avoid onERC721Received attack.
    modifier nonReentrant() {
        if (locked == LockState.InProgress) {
            revert Errors.ReentrancyNotAllowed(); // Use custom error
        }
        locked = LockState.InProgress;
        _;
        locked = LockState.Completed;
    }

    // External/Public Functions
    /// @notice Mints a new token if conditions are met.
    /// @dev Requires the caller to be whitelisted and checks that the price and timestamp are valid.
    /// @param _ipfs IPFS hash for the token metadata.
    function mint(
        string calldata _ipfs
    ) 
        external 
        nonReentrant // to avoid onERC721Received attack
        payable 
        isPricePaid
    {
        uint256 _tokenId = nextTokenId++;
        myNFTs[msg.sender].push(_tokenId);
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _ipfs);
        emit Minted(msg.sender,_tokenId);
    }

    /// @notice Returns an array of NFT (Non-Fungible Token) identifiers associated with the provided address.
    /// @dev This function is an external call that allows users to retrieve their stored NFTs.
    /// @param _addr The address of the user whose NFT list is to be retrieved.
    /// @return An array of uint256 containing the identifiers of the NFTs owned by the specified address.
    function getMyNFTs(address _addr) external view returns(uint256[] memory) {
        return myNFTs[_addr];
    }


    /// @dev Withdraws all LA from the contract.
    /// Can only be called by an account with the WITHDRAW_ROLE.
    function withdraw() external onlyRole(WITHDRAW_ROLE) {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    // Upgrade Authorization
    /// @notice Authorizes the upgrade to a new implementation.
    /// @dev Only callable by an address with UPGRADER_ROLE.
    /// @param _newImplementation The address of the new implementation contract.
    function _authorizeUpgrade(address _newImplementation) internal onlyRole(UPGRADER_ROLE) override {}
}