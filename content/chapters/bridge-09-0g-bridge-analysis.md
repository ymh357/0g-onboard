---
title: "0G Bridge 现状——哪些已有，哪些缺失？"
---

# 0G Bridge 现状——哪些已有，哪些缺失？

## 本章学习目标

在阅读本章之前，假设你已经了解：
- **规范代币 vs 包装代币**的区别（第 2 章）
- **CCIP 的 TokenAdminRegistry** 如何建立规范映射（第 4 章）
- **NTT 的 Peer 配置与 Hub-and-Spoke 模式** 如何建立规范映射（第 6 章）
- **LayerZero 的 OFT/ONFT 标准与 DVN 安全模型**（第 7 章）

读完本章，你将能够：
- **核心：完整解释"规范映射"是什么、为什么必须要有、以及 0G 如何实现它。**
- **核心：分析 0G 原生资产（A0GI）与外部资产在跨链模式上的选型差异。**
- **核心：识别 0G 生态中"iNFT 跨链"的战略价值及其技术难点。**
- 对比 0G 与 Monad Bridge 在产品层的具体差距。

---

## 1. 规范映射：0G 资产治理的基石

### A. 什么是规范映射？

**规范映射（Canonical Mapping）** 是跨链桥系统中建立的一套**"某资产在某条链上的唯一官方版本"**的对应关系。

**回顾概念链**（建议按顺序理解）：
1. **包装代币**（第 2 章）：不同桥对同一资产铸造不同版本（如 wUSDC、ceUSDC），导致**流动性碎片化**
2. **规范代币**（第 2 章）：某资产在某链上被公认的**唯一官方版本**，所有 DeFi 协议共同指向它
3. **规范映射**（本章）：**将规范代币的关系制度化的机制**——明确定义"以太坊上的 WETH 对应 0G 链上的哪个合约地址"

### B. 为什么 0G 必须建立规范映射？

假设 0G 没有规范映射会发生什么？

1. Wormhole 桥接以太坊 WETH 到 0G，铸造了地址 `0xAAA` 的 wWETH
2. 另一个桥（比如某个第三方桥）也桥接了 WETH 到 0G，铸造了地址 `0xBBB` 的 bWETH
3. 0G 上的 DEX 不知道该以哪个为准——两个池子分别上架，流动性被割裂
4. 用户困惑：到底存哪个 WETH 才能在 0G 的 DeFi 生态中通用？

**规范映射的价值**：0G 官方声明"0G 链上的 WETH 规范版本就是地址 `0xAAA`"。所有 DeFi 协议、钱包、区块浏览器统一指向这个地址。碎片化问题从根源上消失。

### C. 0G 如何实现规范映射？

0G 实际上有**三个跨链协议**可用，而不仅仅是 CCIP 和 Wormhole。

### 0G 的三条跨链通道

| 协议 | 代币标准 | NFT 标准 | 安全模型 | 0G 集成状态 |
| :--- | :--- | :--- | :--- | :--- |
| **Chainlink CCIP** | CCT (Cross-Chain Token) | 无专用标准（通过任意消息实现） | 三网架构 + RMN 独立审计 | A0GI 官方桥接标准 |
| **Wormhole** | NTT (Native Token Transfers) | NFT Bridge（专用模块） | 19 Guardian 节点 13/19 多签 | 文档已支持（Chain ID 67），链上合约部署待确认 |
| **LayerZero** | OFT (Omnichain Fungible Token) | **ONFT (Omnichain NFT)** | DVN 模块化验证网络 | **V2 已部署在 0G 主网**（Endpoint + DVN + Executor 合约均已上线） |

LayerZero 的存在意味着 0G 的跨链选型空间比之前讨论的更大。特别是 **LayerZero OFT** 和 **ONFT** 标准——它们是目前采用率最高的跨链代币/NFT 标准，提供了完全自助部署、无需第三方审批的能力。

> **参考来源**：[LayerZero 0G Mainnet Deployment](https://docs.layerzero.network/v2/deployments/chains/og)

### 代币跨链：三协议对比与选型

**A0GI（原生代币）——确定走 CCIP Burn-and-Mint**：
- 以太坊端：BurnMintTokenPool 执行销毁
- 0G 端：底层系统直接增加余额
- 规范性由 CCIP 的 TokenAdminRegistry 保证——A0GI 在两条链上只有一个注册的 Token Pool

**WETH/USDC 等外部资产——三个协议都可以，但适用场景不同**：

| 决策维度 | CCIP Lock & Mint | NTT Hub-and-Spoke | LayerZero OFT |
| :--- | :--- | :--- | :--- |
| **安全模型** | DON + RMN 双系统验证，N-version programming（第 4 章）。但 RMN 节点数/运营商不公开 | Guardian 13/19 多签，运营商公开（第 5 章） | DVN 模块化验证，应用可自选验证者组合（第 7 章） |
| **运营自主性** | 低：注册第三方代币需与 Chainlink 协调审批 | 高：项目方自主部署 | **最高：完全自助部署，无需任何审批** |
| **资金成本** | 以太坊端 Pool 需预注资流动性 + Rebalancer 运营（第 4 章） | 无需预注资（Hub 端锁用户资金，Spoke 端直接铸造） | 无需预注资（Burn/Mint 或 Adapter Lock/Mint） |
| **链覆盖** | 仅 EVM 链 | EVM + Solana + Sui + Cosmos | **最广：70+ 条链** |
| **协议费用** | LINK 支付 0.063%，原生代币 0.07%（第 4 章） | **无协议费**（仅 Relayer gas） | 按消息收费 |
| **生态统一性** | 与 A0GI 共享 CCIP 基础设施 | 需额外维护 Wormhole 集成 | 需额外维护 LayerZero 集成 |
| **采用率** | 增长中 | 快速增长 | **最高（WBTC 等大型资产已采用）** |

**如何选择？按场景决策**：

1. **A0GI（已确定）** → **CCIP Burn & Mint**。这是 0G 官方既定策略。
2. **高价值外部资产（如 WETH），且只需 EVM 链覆盖** → 优先 **CCIP Lock & Mint**。理由：与 A0GI 统一基础设施，RMN 提供最高安全等级。代价是需要预注资流动性并与 Chainlink 协调注册。
3. **需要快速上线、自主控制，或覆盖非 EVM 链** → **NTT Hub-and-Spoke** 或 **LayerZero OFT**。两者都支持自助部署。NTT 无协议费，LayerZero 链覆盖最广。
4. **同一资产只能选一个协议**——在 0G 上只能有一个规范版本，不能同时走两个协议桥接同一个代币。

**USDC 的特殊情况**：Circle（USDC 发行方）自己提供了 CCTP 跨链协议，CCIP 通过专用的 USDCTokenPool 接入（第 4 章）。如果 Circle 已在 0G 部署 CCTP 支持，这是最优方案——全程使用 Circle 官方合约，不产生包装代币。如果 CCTP 尚未覆盖 0G，则回退到 Lock/Release、NTT 或 OFT。

**核心原则**：无论选择哪个协议，最终目的都是相同的——**每个资产在 0G 链上只有一个官方合约地址**。

> **参考来源**：
> - [Chainlink CCIP Token Pools](https://docs.chain.link/ccip/concepts/cross-chain-token/evm/token-pools)
> - [Wormhole NTT 概述](https://wormhole.com/docs/products/token-transfers/native-token-transfers/overview/)
> - [LayerZero OFT 标准](https://docs.layerzero.network/v2/home/token-standards/oft-standard)

---

## 2. 0G 的灵魂资产：iNFT 的跨链挑战与路径

0G 不仅仅有代币，更有 **iNFT (Intelligent NFT)**——可以在链上运行的 AI Agent。

### A. 为什么 iNFT 必须跨链？

**训练在 0G，交易在以太坊**：一个在 0G 链上训练成熟的 AI 绘画 Agent，其所有权证书（iNFT）需要跨链到以太坊的 OpenSea 上交易，或者部署到其他链的 DApp 中运行。

### B. ERC-7857：0G Labs 提出的 iNFT 标准

**ERC-7857** 不是一个模糊的"未来协议"——它是 **0G Labs 主导提出的真实 EIP 标准**，全称"AI Agents NFT with Private Metadata"。它定义了：

- **加密元数据**：AI 模型的智能、个性、训练数据以加密格式存储在链上，而非明文
- **安全传输机制**：当 iNFT 所有权转移时，利用 Oracle 和加密系统**重新加密** AI 模型数据，确保只有新持有者能解密
- **可插拔验证**：支持 **TEE（可信执行环境）** 和 **ZKP（零知识证明）** 两种验证方式

> **参考来源**：[ERC-7857 Standard | 0G Documentation](https://docs.0g.ai/developer-hub/building-on-0g/inft/erc7857)

### C. iNFT 跨链的技术难点

iNFT 跨链比普通代币跨链复杂得多，因为它不只是"转一笔钱"，而是要迁移一个"带有加密 AI 模型数据的智能体"：

1.  **元数据庞大且敏感**：iNFT 包含 AI 模型权重的哈希、加密配置和运行参数。普通的 ERC-20 桥无法承载这些数据，需要任意消息传递能力。
2.  **重新加密问题**：iNFT 的元数据是加密的，跨链到目标链后，加密上下文（如 TEE 环境）可能不同，需要在传输过程中**重新加密**以适配目标链的验证环境。
3.  **状态同步**：iNFT 在 0G 链上可能持续进化（模型更新）。跨链后的副本如何与源链保持同步？是"一次性迁移"还是"持续镜像"？

### D. 三条可行的技术路径

| 方案 | 机制 | 优势 | 局限 |
| :--- | :--- | :--- | :--- |
| **LayerZero ONFT** | 专用的 ONFT721 标准：源链 Lock/Burn NFT，目标链 Mint。支持 Adapter 模式兼容已有合约 | **最成熟的 NFT 跨链标准**；已部署在 0G 主网；支持 Composed Messages（NFT 到账后触发自定义逻辑） | 标准设计面向普通 ERC-721，不原生支持 ERC-7857 的加密元数据重新加密 |
| **Wormhole NFT Bridge** | 专用 NFT Bridge 模块：托管源链 NFT，在目标链铸造包装版本，支持完整元数据保存 | 覆盖 30+ 条链（含 Solana、Sui）；有独立的 NFT 传输白皮书 | 同样不原生支持加密元数据的重新加密逻辑 |
| **CCIP 任意消息传递** | 无专用 NFT 标准，但可通过 `data` 字段传递任意编码数据（含 NFT 元数据 + 铸造指令） | 可完全自定义逻辑，最灵活；可与代币传输组合（如"NFT + 支付"原子操作） | 需要开发者自行实现全部 NFT 编解码和铸造逻辑，开发量最大 |

### E. 0G iNFT 跨链的推荐策略

**没有现成方案能直接满足 ERC-7857 的全部需求**——三条路径都需要在标准 NFT 跨链能力之上，额外构建加密元数据的重新加密层。

推荐分两步走：
1.  **短期（所有权跨链）**：使用 **LayerZero ONFT**（已部署在 0G 主网，最快落地）实现 iNFT 所有权的跨链转移。元数据通过 tokenURI 指向 0G 存储层，目标链通过 URI 读取（元数据本身不跨链迁移）。
2.  **长期（完整迁移）**：基于 CCIP 或 LayerZero 的任意消息传递能力，自研 **ERC-7857 跨链适配层**：在传输过程中调用 TEE/ZKP 验证服务完成元数据重新加密，实现 iNFT 的"连体迁移"（所有权 + 加密模型数据一起跨链）。

> **参考来源**：
> - [LayerZero ONFT Quickstart](https://docs.layerzero.network/v2/developers/evm/onft/quickstart)
> - [Wormhole NFT Bridge Whitepaper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0006_nft_bridge.md)

---

## 3. 0G vs. Monad Bridge：全方位差距清单

| 维度 | Monad Bridge (目标) | 0G 当前状态 (现状) |
| :--- | :--- | :--- |
| **Gas 代付** | **Axelar 自动代付** | **用户手动准备** |
| **失败处理** | **有状态原子回滚** | **异步手动领取** |
| **规范映射** | **NTT + 官方注册表** | **三协议可用（CCIP + NTT + OFT）** |
| **iNFT 跨链** | 尚未重点涉及 | **LayerZero ONFT 已可用（短期）；ERC-7857 适配层待建（长期）** |

---

## 4. 构建建议：从小到大的三步走

1.  **第一步：基于 SDK 封装 A0GI 的一键跨链**（解决 Gas 费痛点）。
2.  **第二步：为 WETH/USDC 建立规范映射**（从 CCIP Lock & Mint、NTT Hub-and-Spoke、LayerZero OFT 中选型，在 0G 链上确立唯一官方版本）。
3.  **第三步：用 LayerZero ONFT 实现 iNFT 所有权跨链**（短期可落地）。
4.  **第四步：自研 ERC-7857 跨链适配层**（长期目标，实现加密 AI 模型的完整跨链迁移，建立 0G 核心竞争力）。

---

## 本章小结

- **规范映射是跨链治理的基石**：它解决的是"同一资产在目标链上应该是哪个合约地址"的问题。没有规范映射，就会产生多个互不兼容的包装代币，导致流动性碎片化。
- **0G 的三协议格局**：CCIP（A0GI 官方标准 + 最高安全）、Wormhole NTT（无协议费 + 多链覆盖）、LayerZero OFT/ONFT（最广链覆盖 + 完全自助 + 已部署主网）。同一资产只能选一个协议建立规范映射。
- **iNFT 跨链有明确路径**：短期用 LayerZero ONFT 实现所有权跨链；长期需自研 ERC-7857 适配层解决加密元数据的重新加密问题。
- **Gas 代付是刚需**：没有 Gas 代付的跨链桥不是合格的生产级产品。

在最后一章，我们将制定 0G Bridge MVP 的构建蓝图。
