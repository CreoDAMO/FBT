
export interface OpenZeppelinContractTemplate {
  name: string;
  description: string;
  category: 'token' | 'governance' | 'security' | 'utility';
  features: string[];
  solidity: string;
  constructorParams: Array<{
    name: string;
    type: string;
    description: string;
    defaultValue?: string;
  }>;
}

export const OPENZEPPELIN_TEMPLATES: Record<string, OpenZeppelinContractTemplate> = {
  ERC20_ADVANCED: {
    name: "Advanced ERC20 Token",
    description: "Feature-rich ERC20 token with OpenZeppelin security features",
    category: 'token',
    features: ['Mintable', 'Burnable', 'Pausable', 'Access Control', 'Permit'],
    solidity: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FastBiteToken is ERC20, ERC20Burnable, ERC20Permit, Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address admin
    ) ERC20(name, symbol) ERC20Permit(name) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _mint(admin, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}`,
    constructorParams: [
      { name: 'name', type: 'string', description: 'Token name', defaultValue: 'FastBite Token' },
      { name: 'symbol', type: 'string', description: 'Token symbol', defaultValue: 'FBT' },
      { name: 'initialSupply', type: 'uint256', description: 'Initial token supply', defaultValue: '1000000000000000000000000000' },
      { name: 'admin', type: 'address', description: 'Admin wallet address' }
    ]
  },

  DAO_GOVERNOR_COMPLETE: {
    name: "Complete DAO Governor",
    description: "Full-featured DAO with Governor, Timelock, and Votes",
    category: 'governance',
    features: ['Governor', 'Timelock', 'Voting Token', 'Quorum', 'Proposals'],
    solidity: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract FastBiteDAO is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    constructor(
        IVotes _token,
        TimelockController _timelock,
        string memory _name,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 _quorumPercentage
    )
        Governor(_name)
        GovernorSettings(_votingDelay, _votingPeriod, _proposalThreshold)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}`,
    constructorParams: [
      { name: 'token', type: 'address', description: 'Voting token contract address' },
      { name: 'timelock', type: 'address', description: 'Timelock controller address' },
      { name: 'name', type: 'string', description: 'DAO name', defaultValue: 'FastBite DAO' },
      { name: 'votingDelay', type: 'uint256', description: 'Voting delay in blocks', defaultValue: '7200' },
      { name: 'votingPeriod', type: 'uint256', description: 'Voting period in blocks', defaultValue: '50400' },
      { name: 'proposalThreshold', type: 'uint256', description: 'Proposal threshold', defaultValue: '1000000000000000000000' },
      { name: 'quorumPercentage', type: 'uint256', description: 'Quorum percentage', defaultValue: '4' }
    ]
  },

  SECURE_ESCROW: {
    name: "Secure Escrow Contract",
    description: "Multi-signature escrow with OpenZeppelin security",
    category: 'security',
    features: ['Reentrancy Guard', 'Pausable', 'Access Control', 'Multi-sig'],
    solidity: `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FastBiteEscrow is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    struct Order {
        bytes32 orderId;
        address customer;
        address merchant;
        address driver;
        uint256 amount;
        IERC20 token;
        OrderStatus status;
        uint256 createdAt;
        uint256 deliveryTime;
    }

    enum OrderStatus { Pending, Confirmed, InTransit, Delivered, Cancelled, Disputed }

    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId;

    event OrderCreated(uint256 indexed id, bytes32 indexed orderId, address indexed customer, uint256 amount);
    event OrderCompleted(uint256 indexed id);
    event OrderCancelled(uint256 indexed id);
    event DisputeRaised(uint256 indexed id);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ARBITER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    function createOrder(
        bytes32 orderId,
        address merchant,
        address driver,
        uint256 amount,
        IERC20 token
    ) external payable nonReentrant whenNotPaused returns (uint256) {
        require(amount > 0, "Amount must be positive");
        
        if (address(token) == address(0)) {
            require(msg.value == amount, "Incorrect ETH amount");
        } else {
            token.safeTransferFrom(msg.sender, address(this), amount);
        }

        uint256 id = nextOrderId++;
        orders[id] = Order({
            orderId: orderId,
            customer: msg.sender,
            merchant: merchant,
            driver: driver,
            amount: amount,
            token: token,
            status: OrderStatus.Pending,
            createdAt: block.timestamp,
            deliveryTime: 0
        });

        emit OrderCreated(id, orderId, msg.sender, amount);
        return id;
    }

    function completeOrder(uint256 id) external nonReentrant whenNotPaused {
        Order storage order = orders[id];
        require(order.status == OrderStatus.InTransit, "Invalid status");
        require(msg.sender == order.customer || msg.sender == order.driver, "Unauthorized");

        order.status = OrderStatus.Delivered;
        order.deliveryTime = block.timestamp;

        // Distribution: 85% to merchant, 15% to driver
        uint256 merchantAmount = (order.amount * 85) / 100;
        uint256 driverAmount = order.amount - merchantAmount;

        if (address(order.token) == address(0)) {
            payable(order.merchant).transfer(merchantAmount);
            payable(order.driver).transfer(driverAmount);
        } else {
            order.token.safeTransfer(order.merchant, merchantAmount);
            order.token.safeTransfer(order.driver, driverAmount);
        }

        emit OrderCompleted(id);
    }

    function cancelOrder(uint256 id) external nonReentrant whenNotPaused {
        Order storage order = orders[id];
        require(order.status == OrderStatus.Pending, "Cannot cancel");
        require(msg.sender == order.customer || hasRole(ARBITER_ROLE, msg.sender), "Unauthorized");

        order.status = OrderStatus.Cancelled;

        if (address(order.token) == address(0)) {
            payable(order.customer).transfer(order.amount);
        } else {
            order.token.safeTransfer(order.customer, order.amount);
        }

        emit OrderCancelled(id);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}`,
    constructorParams: [
      { name: 'admin', type: 'address', description: 'Admin wallet address' }
    ]
  }
};

export function getTemplateByCategory(category: string): OpenZeppelinContractTemplate[] {
  return Object.values(OPENZEPPELIN_TEMPLATES).filter(template => template.category === category);
}

export function getTemplateByName(name: string): OpenZeppelinContractTemplate | undefined {
  return OPENZEPPELIN_TEMPLATES[name];
}
