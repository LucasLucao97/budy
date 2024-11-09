// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC721Upgradeable.sol";
import "./ERC721EnumerableUpgradeable.sol";
import "./ERC721URIStorageUpgradeable.sol";
import "./AccessControlUpgradeable.sol";
import "./Initializable.sol";
import "./UUPSUpgradeable.sol";

/// @title BudyNFTStorage Contract
/// @notice This abstract contract manages the storage for an ERC721 token system with role-based access control and upgradeability.
abstract contract BudyNFTStorage is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {

    /// @notice The role that allows users to upgrade contracts.
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    /// @notice The role that allows users to whitelist addresses.
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    // State variables
    /// @notice The next token ID to be minted.
    uint256 public nextTokenId;

    /// @notice The Price of the token.
    uint256 constant PRICE = 0.1 ether;

    /// @notice Mapping of NFTs owned by each address.
    mapping (address => uint256[]) internal myNFTs;

    /// @title LockState Enum and Non-Reentrancy Modifier
    /// @notice Manages operation locking states to prevent reentrancy attacks.
    /// @dev The `LockState` enum has three states: 
    ///      - `NotStarted`: Process has not started (not used).
    ///      - `InProgress`: Process is ongoing.
    ///      - `Completed`: Process is finished.
    ///     Changing from 1 to 2 and again to 1 for gas saving
    ///
    /// @enum LockState
    /// @member NotStarted Initial state (not used).
    /// @member InProgress Current operation state.
    /// @member Completed Final state after completion.
    enum LockState {
        NotStarted,  // 0 - not used
        InProgress,  // 1
        Completed    // 2
    }

    /// @notice Tracks the current lock state to prevent reentrancy.
    LockState internal locked;







    // The following functions are overrides required by Solidity.
    
    /// @notice Updates the ownership of a token.
    /// @dev Overrides the _update function from ERC721 and ERC721Enumerable.
    /// @param to The address to which the token is being transferred.
    /// @param tokenId The ID of the token being transferred.
    /// @param auth The address authorized to perform the update.
    /// @return The address to which the token was transferred.
    function _update(address to, uint256 tokenId, address auth) internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /// @notice Increases the balance of an account.
    /// @dev Overrides the _increaseBalance function from ERC721 and ERC721Enumerable.
    /// @param account The address of the account whose balance is being increased.
    /// @param value The amount by which to increase the balance.
    function _increaseBalance(address account, uint128 value) internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._increaseBalance(account, value);
    }

    /// @notice Retrieves the token URI for a specific token ID.
    /// @dev Overrides the tokenURI function from ERC721 and ERC721URIStorage.
    /// @param tokenId The ID of the token for which to retrieve the URI.
    /// @return The token URI as a string.
    function tokenURI(uint256 tokenId) public view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @notice Checks if the contract supports a specific interface.
    /// @dev Overrides the supportsInterface function from multiple contracts.
    /// @param interfaceId The ID of the interface to check for support.
    /// @return True if the interface is supported, false otherwise.
    function supportsInterface(bytes4 interfaceId) public view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}