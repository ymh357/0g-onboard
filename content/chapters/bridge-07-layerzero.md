---
title: "第三条路——LayerZero 与模块化安全"
---

# 第三条路——LayerZero 与模块化安全

## 本章学习目标

在阅读本章之前，假设你已经了解：
- **CCIP 的三网安全架构**（Committing DON + Executing DON + RMN）（第 4 章）
- **Wormhole 的 Guardian 13/19 多签机制**（第 5 章）
- **NTT 的 Peer 配置与规范映射**（第 6 章）

读完本章，你将能够：
- **核心：解释 LayerZero 与 CCIP、Wormhole 在安全哲学上的根本差异——"应用级安全"vs"协议级安全"。**
- **核心：完整描述一笔 LayerZero 消息从 send() 到 lzReceive() 的四步生命周期。**
- **核心：解释 DVN（去中心化验证者网络）的"Required + Optional 阈值"机制。**
- **核心：说出 OFT 和 ONFT 标准如何建立代币/NFT 的规范映射。**
- 理解为什么 0G 在已有 CCIP 和 Wormhole 的情况下，仍然需要 LayerZero。

---

## 1. 为什么 0G 需要第三个跨链协议？

在前面的章节中，我们已经了解了 CCIP（第 4 章）和 Wormhole（第 5-6 章）。一个自然的问题是：**两个还不够吗？**

答案在于三个协议各自的长处无法互相替代：

| 能力 | CCIP | Wormhole | LayerZero |
| :--- | :--- | :--- | :--- |
| **A0GI 官方桥接** | 已确定 | - | - |
| **NFT 跨链标准** | 无专用标准 | NFT Bridge 模块 | **ONFT 标准（最成熟）** |
| **自助部署** | 需与 Chainlink 协调 | 项目方自主 | **完全自助，无需审批** |
| **链覆盖** | EVM 链 | 30+ 链 | **70+ 链（最广）** |
| **0G 主网集成** | 是（A0GI 官方桥） | 文档已支持（Chain ID 67），链上部署待确认 | **是（合约已部署）** |

对于 0G 来说，LayerZero 填补了两个关键空白：
1. **iNFT 跨链**：0G 的核心资产 iNFT（ERC-7857）需要专业的 NFT 跨链标准，LayerZero 的 ONFT 是目前最成熟的方案。
2. **极速自助上线**：当 0G 生态中的新项目想要快速实现代币跨链时，LayerZero OFT 允许它们完全自助部署，无需等待任何第三方审批。

> **参考来源**：[LayerZero 0G Mainnet Deployment](https://docs.layerzero.network/v2/deployments/chains/og)

---

## 2. LayerZero 的核心哲学：应用级安全

CCIP 和 Wormhole 采用的是**"协议级安全"**——由协议统一决定谁来验证消息，所有应用共享同一套验证者集合。

LayerZero V2 走了一条完全不同的路：**"应用级安全"**——每个应用（OApp）可以自主选择由谁来验证自己的跨链消息。

**类比**：
- CCIP/Wormhole 像是一栋大楼统一配备的安保团队——所有住户共享同一批保安，安全标准由物业统一制定。
- LayerZero 像是每个住户可以自主选择安保公司——你可以同时雇佣 Google Cloud 和 Deutsche Telekom 来守门，也可以选择更多。

这种设计的**优势**是灵活性和自主权；**风险**是如果应用开发者选错了验证者组合，安全性可能不如 CCIP 的统一标准。

---

## 3. 一笔跨链消息的完整旅程

### 第一步：Dispatch（派发）

源链上的应用合约调用 **Endpoint** 的 `send()` 函数。Endpoint 是 LayerZero 在每条链上部署的核心入口合约——**不可变、无需许可**。

Endpoint 接收消息后：
1. 分配全局唯一的 **GUID** 和递增的 **nonce**（用于 exactly-once 投递语义）
2. 将消息传递给应用配置的 **MessageLib（消息库）** 进行标准化编码

### 第二步：Packet Emission（数据包发射）

MessageLib 将消息编码为标准化的 **Message Packet**，并作为链上事件（event）发出。数据包包含：
- 源/目标 Endpoint ID
- 发送/接收合约地址
- Payload（消息内容）
- Payload Hash（用于验证完整性）

### 第三步：Verification（验证）

这是 LayerZero 与其他协议最大的区别所在。

数据包发射后，应用预先配置的 **DVN（去中心化验证者网络）** 节点会各自独立验证该消息的 `payloadHash`。一旦满足阈值要求（详见第 4 节），消息被标记为"已验证"并提交到目标链的 Endpoint。

### 第四步：Execution（执行）

**Executor** 在目标链上调用 Endpoint 的 `lzReceive()` 函数，将已验证的消息投递给接收合约。

Executor 的关键特性：
- **由源链付费**：用户在源链上用原生代币支付目标链的执行费用。Executor 负责自行获取目标链 gas——**用户无需持有目标链代币**。
- **无需许可**：`lzReceive()` 是公开函数，任何人都可以调用，不必依赖官方 Executor。

> **参考来源**：[LayerZero V2 Protocol Overview](https://docs.layerzero.network/v2/home/protocol/protocol-overview)

---

## 4. DVN：模块化的验证者网络

### A. DVN 是什么？

**DVN（Decentralized Verifier Network，去中心化验证者网络）** 是 LayerZero V2 的安全核心。每个 DVN 是一个独立的验证服务，负责确认跨链消息的 `payloadHash` 是否真实。

目前有 **40+ DVN 提供商**可供选择，包括：
- **基础设施巨头**：Google Cloud、Deutsche Telekom
- **加密安全专家**：Polyhedra（zkBridge）、Chainlink、Axelar
- **顶级节点运营商**：Nethermind、BitGo、Luganodes
- **知名机构**：Fidelity、Paxos

### B. Required + Optional 阈值机制

每个应用可以为每条跨链路径独立配置 DVN 组合，使用 **"Required + Optional"** 双层阈值：

```
Required DVNs: [Google Cloud, LayerZero Labs]    // ALL must verify
Optional DVNs: [Polyhedra, Nethermind, BitGo]    // 2-of-3 must verify
```

消息只有在以下条件**同时**满足时才会被提交：
1. **所有 Required DVN** 都已验证通过
2. **Optional DVN** 达到设定阈值（如上例的 2-of-3）

**安全性分析**：以上述配置为例，攻击者必须同时攻破 Google Cloud + LayerZero Labs + Polyhedra/Nethermind/BitGo 中的任意两个，共计至少 4 个独立实体。这些实体分布在不同国家、使用不同技术栈，协同攻破的难度极高。

### C. 0G 主网上可用的 DVN

LayerZero 已在 0G 主网部署了以下 DVN：

| DVN 提供商 | 背景 |
| :--- | :--- |
| **LayerZero Labs** | 协议官方 |
| **BitGo** | 顶级数字资产托管商 |
| **Nethermind** | 以太坊核心客户端开发团队 |
| **Deutsche Telekom** | 德国电信，欧洲最大电信运营商 |
| **Stargate** | LayerZero 生态核心 DeFi 协议 |
| **Luganodes** | 瑞士节点运营商 |

### D. 三种安全模型对比

| 维度 | CCIP（第 4 章） | Wormhole（第 5 章） | LayerZero |
| :--- | :--- | :--- | :--- |
| **验证者选择权** | 无（Chainlink 统一管理） | 无（固定 19 个 Guardian） | **应用自主选择** |
| **验证者数量** | 固定 DON + RMN | 固定 19 个 | **40+ DVN 可选** |
| **安全哲学** | 协议级统一标准 | 协议级统一标准 | **应用级自主安全** |
| **独立审计层** | RMN（独立第三层，但节点数和运营商不公开） | 无 | 通过多 DVN 阈值实现 |
| **最低攻破成本** | 需同时攻破 DON + RMN 两个独立系统 | 需控制 13/19 节点 | **取决于应用配置** |
| **适合谁** | 需要最高安全保障的核心资产 | 需要广泛多签共识的场景 | 需要灵活性和自主权的应用 |

> **参考来源**：[LayerZero DVN Security Stack](https://docs.layerzero.network/v2/concepts/modular-security/security-stack-dvns)

---

## 5. OFT：全链代币标准

**OFT（Omnichain Fungible Token）** 是 LayerZero 的代币跨链标准，功能上对标 CCIP 的 CCT 和 Wormhole 的 NTT。

### A. 两种工作模式

**Burn/Mint 模式**——适用于新发行的代币：
1. OFT 合约本身就是代币合约，拥有铸造权
2. 源链 `_debit()` 销毁代币 → LayerZero 消息 → 目标链 `_credit()` 铸造等量代币
3. 全局总供应量始终守恒

**OFTAdapter（Lock/Mint 模式）**——适用于已有的 ERC-20 代币：
1. 在原始代币所在链上部署 **OFTAdapter** 合约（外部控制器，不修改原始代币合约）
2. 源链：用户的代币被转入 Adapter 锁定 → 目标链：铸造等量代币
3. 反向转移时：目标链销毁 → 源链从 Adapter 解锁

**与 NTT 的对比**：OFTAdapter 的角色类似于 NTT 的 Hub-and-Spoke 中的 Hub 端 NTT Manager（第 6 章）——都是"不修改原始合约，通过外部控制器实现跨链"。

### B. 规范映射：Peer 配置

OFT 通过 `setPeer(dstEid, peerAddress)` 建立跨链对等关系：
- 每条链上的 OFT 合约必须注册对端合约的地址
- 只有配置为 Peer 的合约才能互相收发代币
- 一个 OFT 在每条链上只有**一个**合法对端——这就是规范映射

这与 NTT 的 Peer 配置（第 6 章）和 CCIP 的 TokenAdminRegistry（第 4 章）异曲同工——三种协议用不同的机制实现了同一个目标。

### C. 费用结构

OFT 通过 `quoteSend()` 在源链预估费用，支持原生代币或 LayerZero 治理代币支付。

**与 CCIP 的关键区别**：LayerZero 协议本身**不收取桥接金额的百分比费用**。费用仅覆盖 DVN 验证和 Executor 执行的服务成本。相比 CCIP 的 0.063%-0.07% 费率（第 4 章），这在大额转账时差异显著。

> **参考来源**：[LayerZero OFT Standard](https://docs.layerzero.network/v2/home/token-standards/oft-standard)

---

## 6. ONFT：全链 NFT 标准

**ONFT（Omnichain NFT）** 是 LayerZero 的 NFT 跨链标准。这是 0G 的 iNFT 跨链路径中最关键的一环。

### A. ONFT721：Burn & Mint 模式

适用于新发行的 NFT 项目：
1. 源链：验证所有权 → 销毁 NFT
2. LayerZero 消息传递（Token ID 保持不变）
3. 目标链：铸造同一 Token ID 的 NFT

### B. ONFT721Adapter：Lock & Mint 模式

适用于已存在的 NFT 集合（如 0G 的 iNFT）：
1. 在原始 NFT 所在链上部署 Adapter（每个 ERC-721 集合只能有一个 Adapter）
2. 源链：NFT 转入 Adapter 锁定
3. 目标链：铸造新 NFT
4. 反向：目标链销毁 → 源链从 Adapter 解锁

**不修改原始 NFT 合约**——这对 iNFT 至关重要，因为 ERC-7857 合约的加密元数据逻辑不应被跨链代码污染。

### C. 元数据处理

ONFT 在跨链时**只传递 Token ID，不传递元数据本身**。如果元数据 URI 指向链无关的存储（如 IPFS、Arweave 或 0G Storage），则目标链通过相同的 URI 读取元数据，自然保持一致。

**这对 iNFT 的影响**：iNFT 的 AI 模型数据存储在 0G Storage 上，跨链时只需传递 Token ID + tokenURI。模型数据本身不需要跨链迁移——目标链通过 URI 读取 0G Storage 即可。但 ERC-7857 的加密元数据重新加密问题仍需额外适配（第 10 章）。

### D. Composed Messages：NFT 到账后的自动化

ONFT 支持**组合消息（Composed Messages）**——在 NFT 跨链完成后自动触发额外逻辑：

1. NFT 在目标链铸造完成
2. 自动发送一条组合消息到指定合约
3. 该合约的 `lzCompose()` 执行自定义逻辑（如：上架 Marketplace、触发质押、激活 AI Agent）

**故障隔离**：组合消息的失败**不会回滚**原始的 NFT 跨链操作——NFT 已经安全到账，后续逻辑可以独立重试。

> **参考来源**：[LayerZero ONFT721 Quickstart](https://docs.layerzero.network/v2/developers/evm/onft/quickstart)

---

## 7. 三协议全景：各司其职

学完本章后，0G 的三协议格局已经完整：

| 职责 | 推荐协议 | 理由 |
| :--- | :--- | :--- |
| **A0GI 核心资产** | CCIP | 官方既定标准，RMN 提供最高安全 |
| **外部 ERC-20 代币** | CCIP / NTT / OFT（按场景选型，详见第 10 章） | 同一资产只选一个协议 |
| **iNFT 跨链** | **LayerZero ONFT** | 最成熟的 NFT 跨链标准，已部署 0G 主网 |
| **生态项目自助跨链** | **LayerZero OFT** | 完全自助部署，无需审批，上线最快 |

---

## 本章小结

- **LayerZero 填补了 CCIP 和 Wormhole 的空白**：专业的 NFT 跨链标准（ONFT）和完全自助的部署能力。
- **"应用级安全"是 LayerZero 的核心哲学**：每个应用自主选择 DVN 验证者组合，灵活性最高，但安全性取决于配置质量。
- **DVN 的 Required + Optional 阈值机制**：通过多层独立验证者实现可配置的安全等级。0G 主网已有 6 个 DVN 可用（包括 Deutsche Telekom、BitGo 等）。
- **OFT 通过 Peer 配置建立规范映射**：与 CCIP TokenAdminRegistry、NTT Peer 配置异曲同工——三种协议用不同机制实现同一目标。
- **ONFT 是 iNFT 跨链的桥头堡**：通过 Adapter 模式兼容已有 ERC-7857 合约，只传 Token ID 不传元数据，配合 0G Storage 实现"数据不动、引用跨链"。

在下一章，我们将拆解 Monad Bridge 案例，看它是如何利用这些底层原理构建出极致用户体验的。
