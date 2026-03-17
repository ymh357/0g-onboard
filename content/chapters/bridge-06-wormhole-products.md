---
title: "Wormhole 产品矩阵——NTT、WTT、Connect 与 SDK"
---

# Wormhole 产品矩阵——NTT、WTT、Connect 与 SDK

## 本章学习目标

在阅读本章之前，假设你已经了解：
- **Lock-and-Mint 和 Burn-and-Mint** 两种桥接机制（第 2 章）
- **VAA 生命周期**（第 4 章）

读完本章，你将能够：
- **核心：清晰描述 NTT Manager 的物理本质（它是代币合约的“控制器合约”）**
- **核心：解释代币合约、NTT Manager 与 Wormhole 核心协议的三层架构关系**
- **核心：说出 Hub-and-Spoke 模式相较于“全链原生（Burn-and-Mint）”模式的现实优势**
- **核心：解释 Wormhole SDK 路由发现（Route Discovery）的底层原理**
- 理解 Connect 组件如何简化前端集成

---

## 1. NTT Manager：代币合约的“首席代理人”

很多人误以为 NTT 就是代币合约，或者是一个黑盒。**事实上，NTT Manager 是一组由项目方亲自部署的智能合约（Smart Contract）。**

### A. 它的物理位置：三层架构
在一个完整的跨链系统中，NTT Manager 处于承上启下的核心位置，实现了跨链逻辑与代币逻辑的解耦：

1.  **资产层（代币合约）**：负责最基础的账本记录（如 0G 代币合约）。它通常不包含任何跨链代码，只负责管账。
2.  **逻辑层（NTT Manager 合约）**：**这就是我们要讨论的主角**。它部署在代币所在的每一条链上，负责“下达指令”。它决定了什么时候该销毁钱，什么时候该印钱，以及什么时候该把钱锁进保险柜。
3.  **传输层（Wormhole 核心协议）**：负责“跑腿”。它把逻辑层下达的指令封装成 VAA，安全地搬运到目标链。

### B. 它与代币合约的关系：授权与执行
NTT Manager 并不是代币合约的一部分，而是一个**外部控制器**。
*   **在支持 Mint/Burn 的链上（Spoke）**：项目方必须在代币合约中赋予 NTT Manager **“铸造者权限（Minter Role）”**。这样它才能在收到合法的跨链 VAA 时，命令代币合约印出新币。
*   **在锁仓（Hub）链上**：它扮演**保险柜**的角色。当你转账出去时，它会把你的代币锁在自己的合约地址下；当你转账回来时，它再解锁并退还给你。

### C. 为什么要这么设计？
1.  **安全性**：代币合约应保持极简。将复杂的跨链逻辑（如处理 19 个守护者签名、验证 VAA 等）剥离到 NTT Manager，可以极大降低主合约受攻击的风险。
2.  **可维护性**：如果跨链协议（如 Wormhole）未来升级了，你只需更换 NTT Manager 实例，**无需触动无法更改的代币主合约**。

### D. NTT 如何建立"规范映射"？

在第 2 章我们讲过"规范代币"是解决流动性碎片化的关键。NTT Manager 正是 Wormhole 体系中实现**规范映射**的核心机制。

**规范映射的本质**：确保一个代币在目标链上只有**一个官方版本**。NTT 通过以下方式实现：

1.  **项目方自行部署所有链上的代币合约**：不同于传统桥（由桥协议铸造 wrapped token），NTT 中代币发行方自己在每条链上部署代币合约。因此，目标链上不会出现 wToken、ceToken 等多个版本。
2.  **Peer 配置建立映射**：每条链上的 NTT Manager 必须配置它在其他链上的 **Peer（对等节点）**——即"我在以太坊的伙伴是地址 0xABC，在 0G 的伙伴是地址 0xDEF"。这个 Peer 配置**就是规范映射的链上表达**。
3.  **模式约束保证一致性**：如果源链 NTT Manager 配置为 LOCKING 模式（Hub），目标链的对应 NTT Manager 必须配置为 BURNING 模式（Spoke），否则转移将失败。这种严格约束确保了整个拓扑的一致性。

与 CCIP 的 TokenAdminRegistry（第 4 章）类似，NTT 的 Peer 配置就是 Wormhole 世界中的"官方电话簿"——定义了"某个代币在某条链上该找谁"。

> **参考来源**：[Wormhole NTT Overview](https://wormhole.com/docs/products/token-transfers/native-token-transfers/overview/)

---

## 2. 深入 Hub-and-Spoke：规范映射的拓扑表达

在 NTT 框架内部，有两种主要模式：**全链 Burn-and-Mint（普通 NTT）** 和 **Hub-and-Spoke（枢纽-辐射）**。

Hub-and-Spoke 的本质就是对”规范映射”的**拓扑表达**：
- **Hub = 规范链 (Canonical Chain)**：代币的原始供应量锁定于此，NTT Manager 配置为 **LOCKING** 模式
- **Spoke = 派生链 (Derivative Chain)**：代币通过 Burn/Mint 与 Hub 的锁定量保持一致，NTT Manager 配置为 **BURNING** 模式
- **Peer 配置 = 规范映射**：每个 NTT Manager 知道它的对等节点在哪条链、什么地址

### A. 解决“改不动”的老旧合约问题（最大的 Why）
如果你要在以太坊上为一个已经上线多年、权限已丢弃或没写 `mint` 函数的老代币做跨链，**普通 NTT 是不可能实现的**，因为你没法给 NTT Manager 授权印钞。
*   **Hub-and-Spoke 的降维打击**：它在以太坊端不需要任何 `Mint` 权限，它只是一个**“高级存钱柜（Vault）”**。用户把老币存进来锁住，新链直接印新币。这让“老树发新芽”成为了可能。

### B. 资产的“落叶归根”与信任锚定
*   **优势**：所有分支链的代币最终都由 Hub 链上的真实资产背书。这种“锚定感”在面对大额持币者或机构用户时，比完全分散的代币更容易获得信任。

### C. 风险隔离与“熔断止损”
*   **优势**：NTT 内置了**速率限制（Rate Limiting）**。如果某条分支链（Spoke）被黑，黑客想通过桥变现时会触发限额（如每天限额 100 万）。项目方有充足的时间在损失扩大前**手动关停合约**。这把“全毁灭风险”降级为了“局部可控损失”。

| 维度 | 普通 NTT (全链 Burn-and-Mint) | Hub-and-Spoke NTT |
| :--- | :--- | :--- |
| **分支链间转移** | 极速（Burn/Mint），无需绕回主网 | **同样极速**，Spoke 间也是 Burn/Mint |
| **代币版本** | 全链统一原生版本 | **全链统一原生版本** |
| **合约改动要求** | 极高：全链都要有 Mint 权限 | **极低：老链零改动（仅需锁仓）** |

---

## 3. 路由发现（Route Discovery）：SDK 是如何找路的？

当你调用 `wh.resolver().findRoutes()` 时，SDK 内部经历了四个步骤：

1.  **协议扫描（Registry Scan）**：
    SDK 扫描已注册协议列表（NTT、WTT、CCTP 等），筛选出在源链和目标链同时“在线”的候选者。

2.  **路径验证（Path Validation）**：
    *   **NTT 路由**：检查两链是否都部署了该代币的 NTT Manager 合约。
    *   **WTT 路由**：检查 Wormhole 全局注册表中是否有对应的包装版本。

3.  **约束检查（Constraint Check）**：
    SDK 通过只读调用检查：源链余额是否充足？是否触发了 **NTT 的速率限制**？如果限额已满，该路由会被标记为暂时不可用。

4.  **报价与排序（Quoting & Ranking）**：
    SDK 为每条路径计算 Gas 费、中继费和最终到账金额。它确保开发者始终能自动为用户选择**最安全、最正统**（优先选 NTT/CCTP）或最便宜的路径。

---

## 4. 集成工具：Wormhole Connect 与 SDK

### Wormhole Connect：5 分钟嵌入 UI
它是一个开箱即用的 React 组件。
```tsx
import WormholeConnect from '@wormhole-foundation/wormhole-connect';
// 只需要这一行，你的网站就拥有了完整的跨链转账界面
<WormholeConnect />
```
它会自动处理钱包连接、路由发现结果展示和 VAA 轮询。

### TypeScript SDK：程序化控制
如果你需要构建高度定制化的前端，SDK 提供了原子级的 API：
```typescript
// 获取 0G 链上下文
const dstChain = wh.getChain('Zerog'); // Chain ID 67
// 获取推荐路径
const routes = await resolver.findRoutes({ 
  source: { chain: 'Ethereum', token: 'USDC', amount: '100' }, 
  destination: { chain: dstChain } 
});
```

---

## 本章小结

- **NTT Manager 是独立的智能合约**：它是代币合约的”首席代理人”，负责与底层跨链协议对接，并持有代币的铸造/锁仓权限。
- **NTT 通过 Peer 配置建立规范映射**：确保代币在每条链上只有一个官方版本，从根本上消灭流动性碎片化。这与 CCIP 的 TokenAdminRegistry（第 4 章）异曲同工。
- **三层架构实现解耦**：代币记账（资产层）、跨链控制（逻辑层）、消息搬运（传输层）互不干扰，极大提升了安全性和可升级性。
- **Hub-and-Spoke 是规范映射的拓扑表达**：Hub = 规范链（LOCKING），Spoke = 派生链（BURNING）。它不仅解决了老旧合约的兼容性痛点，还保留了分支间直连的高效性，并通过速率限制提供了”局部止损”能力。
- **SDK 路由发现**：通过协议扫描和路径验证，自动在复杂的跨链路径中寻找最优、最安全的选择。

在下一章，我们将认识 0G 生态的第三个跨链协议——LayerZero，看它如何用"应用级安全"的哲学补全 CCIP 和 Wormhole 的空白。
