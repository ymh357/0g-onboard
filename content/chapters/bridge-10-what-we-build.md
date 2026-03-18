---
title: "终章——构建 0G Bridge MVP 蓝图"
---

# 终章——构建 0G Bridge MVP 蓝图

## 本章学习目标

读完本章，你将能够：
- **核心：定义 0G Bridge MVP（最小可行性产品）的核心功能范围。**
- **核心：描述基于三协议（CCIP + Wormhole + LayerZero）的 0G 跨链技术选型。**
- 理解开发里程碑及长期扩展方向（iNFT 跨链、Mayan 拍卖集成）。

---

## 1. MVP 定义：我们要构建什么？

我们的目标不是建立另一个复杂的门户，而是构建一个**极致专业、品牌感极强**的 0G 专用跨链入口。

### 核心功能规格
1.  **一键到账体验**：集成类似 Axelar 的 Gas Service，解决“Gas 费兑换陷阱”。
2.  **资产全覆盖（基于规范映射）**：
    *   **0G 原生代币**：LayerZero OFT（合约 `ZeroGravityOFT` 已部署，封装 `send()` 即可上线）。
    *   **稳定币/WETH**：Stargate（LayerZero 生态，stg* 合约已在 0G 部署）为主；CCIP 可作为高安全场景的补充通道。
    *   **iNFT**：短期用 LayerZero ONFT 实现所有权跨链；长期自研 ERC-7857 适配层（第 10 章）。
    *   **核心原则**：每个资产在 0G 链上只有一个官方合约地址。当前需注意 stgUSDC vs USDCe 的碎片化问题。
3.  **电竞感 UI**：摆脱通用组件，使用 Next.js + Tailwind 构建 0G AI 风格的界面。
4.  **原子级状态监控**：实时展示验证进度，包含直达各链浏览器的链接。

---

## 2. 技术选型建议

| 模块 | 推荐方案 | 理由 |
| :--- | :--- | :--- |
| **前端框架** | Next.js (App Router) | 极致的性能与路由体验。 |
| **代币结算** | **LayerZero OFT** (0G 原生代币) + **Stargate** (稳定币) | 0G 代币合约就是 OFT（链上已验证）；稳定币通过 Stargate 统一在 LayerZero 体系内。CCIP 可作补充通道。 |
| **iNFT 跨链** | **LayerZero ONFT**（短期） → **ERC-7857 适配层**（长期） | ONFT 是最成熟的 NFT 跨链标准；ERC-7857 的加密元数据需自研适配。 |
| **Gas 代付** | **Axelar Gas Service** 或自研 Solver | 必须解决“无 Gas 费领钱”的痛点。 |
| **状态轮询** | LayerZero Scan API + Chainlink SDK | LayerZero Scan 追踪 OFT/Stargate 交易；CCIP 通道用 Chainlink SDK。 |

---

## 3. 开发里程碑

*   **第一阶段 (MVP)**：Next.js 前端 + wagmi v2 钱包连接 + LayerZero OFT `send()` 封装，实现 0G 代币在 ETH/BSC/0G 间的基本跨链。
*   **第二阶段 (稳定币)**：集成 Stargate Router，实现 USDC/USDT/WETH 跨链。需先解决 Stargate 在 0G 上的流动性问题。
*   **第三阶段 (体验补齐)**：上线 Gas 代付功能（后端 Relayer 服务）；交易状态实时追踪（LayerZero Scan API）。
*   **第四阶段 (iNFT 跨链)**：用 LayerZero ONFT 实现 iNFT 所有权跨链；启动 ERC-7857 适配层研发。
*   **第五阶段 (聚合路由)**：接入 CCIP 等作为补充通道；引入 intent/solver 层实现即时到账。

---

## 本章小结

- 0G Bridge 的成功不在于复杂，而在于**“资产原生化”**和**“零摩擦交互”**。
- **LayerZero 是核心基础设施**（0G 代币 OFT + 稳定币 Stargate + iNFT ONFT），**CCIP 是高安全补充**，**Wormhole 是潜在扩展**。
- 作为构建者，你的使命是利用现有的顶级基础设施，为 0G 用户铺设一条通往 AI 世界的坦途。

**恭喜你！你已经完成了《0G 跨链技术专题》的全部学习。现在，是时候去代码中实现这一切了。**
