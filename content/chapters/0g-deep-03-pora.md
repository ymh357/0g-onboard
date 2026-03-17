# 3. PoRA 激励机制深度解析

## 本章导读

PoRA（Proof of Random Access）是 0G Storage 的核心创新之一，它不仅是一个激励机制，更是确保去中心化存储网络数据可用性的关键。本章将深入剖析 PoRA 的每个细节：为什么需要它、如何设计、如何工作，以及背后的经济学原理。

**学习目标**：
- 理解 PoRA 与其他 Proof 机制（PoW、PoS、PoSt）的本质区别
- 掌握 PoRA 六步流程的完整技术实现
- 深入理解 VRF、Scratchpad、Sealing 等关键技术
- 分析 8TB 限制的设计权衡与去中心化考量
- 理解 PoRA 的经济模型与激励设计

**前置知识**：建议先阅读第二章（Storage 架构）和第二部分教程的第5章（激励机制）

**重要说明**：本章严格基于 [0G 官方文档](https://docs.0g.ai/) 和白皮书。所有协议层面的技术规范（如 Scratchpad 256KB、VRF 算法、8TB 限制）均有官方来源。矿工节点的具体实现优化（如缓存策略、I/O 优化）由各节点软件自行决定，不属于协议规范。

---

## 重要术语说明

**⚠️ 核心概念**：

| 术语 | 大小 | 用途 | 官方来源 |
|------|------|------|---------|
| **Scratchpad（临时计算数据）** | 256 KB<br>(4096 × 64 bytes) | 通过 Blake2b 哈希函数确定性生成，与密封数据做 XOR 混合，防止分布式挖矿 | [官方文档](https://docs.0g.ai/incentive-mechanism/proof-of-random-access) / 白皮书 Figure 6 |
| **Sector（基本存储单元）** | 256 bytes | 数据的最小存储单位，Merkle Tree 的叶子节点 | 白皮书 Section 3.2 |
| **Chunk（挖矿挑战单元）** | 256 KB<br>(1024 Sectors) | 一次 PoRA 挑战验证的数据量，对应 Scratchpad 大小 | 白皮书 Section 3.3 |

**说明**：
- **Scratchpad** 是 PoRA 算法的核心组件，每次挖矿必须重新计算
- 矿工节点可能使用内存缓存优化性能，但具体实现策略由节点软件决定，非协议层规定

详细说明请参见本章 3.2.2 节（VRF）和第5章（Scratchpad 算法）。

---

## 3.1 是什么：PoRA 机制概览

### 3.1.1 核心定义

**PoRA（Proof of Random Access）** = **随机访问证明**

```
┌──────────────────────────────────────────────────────────┐
│                    PoRA 核心思想                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  问题：如何证明矿工真的存储了数据，而不是"声称存储"？  │
│                                                          │
│  PoRA 方案：                                             │
│  1. 随机选择一个位置（Recall Position）                 │
│  2. 要求矿工读取该位置的数据（Sector）                  │
│  3. 矿工提交证明（包含读取的数据 + 计算结果）           │
│  4. 链上验证证明的正确性                                │
│                                                          │
│  关键：                                                  │
│  • 随机性：矿工无法预测下次要读取哪个位置               │
│  • 快速验证：链上验证成本低（不需要重新读取数据）       │
│  • 经济激励：成功提交证明 → 获得奖励                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3.1.2 与其他 Proof 机制的对比

| 机制 | 证明内容 | 随机性来源 | 存储要求 | 计算要求 | 代表项目 |
|------|---------|-----------|---------|---------|---------|
| **PoW** | 工作量（算力） | Nonce 搜索 | 低 | **极高** | Bitcoin |
| **PoS** | 权益质押 | VRF | 低 | 低 | Ethereum 2.0 |
| **PoSt** | 时空证明 | 周期性 | **高** | 中 | Filecoin |
| **PoRep** | 复制证明 | Sealing | **高** | **高** | Filecoin |
| **PoRA** | **随机访问** | **VRF** | **高** | **低** | **0G Storage** |

**关键区别**：

```
PoW (Bitcoin):
  目标：防止双花攻击
  方式：暴力搜索哈希碰撞
  问题：计算浪费、不保证数据存储

PoSt (Filecoin):
  目标：证明持续存储数据
  方式：周期性生成时空证明
  问题：计算开销大、验证复杂

PoRA (0G Storage):
  目标：证明数据可随机访问（可用性）
  方式：VRF 随机选择位置，快速读取证明
  优势：低计算、高效验证、真正的"可用性"保证
```

**PoRA 的独特价值**：

```
┌──────────────────────────────────────────────────────────┐
│           PoRA 解决的核心问题                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  问题 1："存而不存"                                      │
│    矿工声称存储了数据，但实际删除了                      │
│    PoRA：随机访问无法作假，必须真实存储                 │
│                                                          │
│  问题 2："存而不可用"                                    │
│    矿工存储了数据，但读取速度极慢                        │
│    PoRA：快速响应才能获得奖励，激励高性能存储           │
│                                                          │
│  问题 3："中心化风险"                                    │
│    大矿工垄断存储市场                                    │
│    PoRA：8TB 限制降低门槛，鼓励去中心化                 │
│                                                          │
│  问题 4："AI 工作负载不匹配"                             │
│    传统证明机制不适合 AI 的随机读取模式                  │
│    PoRA：模拟 AI 训练的数据访问，天然适配               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 3.2 为什么：PoRA 设计目标与权衡

### 3.2.1 为什么需要随机访问证明？

**数据可用性 vs 数据存在性**

```
数据存在性（Data Existence）：
  证明："数据存储在某处"
  例子：Merkle Root 在链上
  问题：不保证数据能被读取

数据可用性（Data Availability）：
  证明："数据存储且可以被快速读取"
  PoRA 目标：可用性
```

**为什么"存在"不够？**

```
场景：AI 训练需要读取数据集

如果只证明"存在"：
  矿工可以：
    ✗ 把数据存储在极慢的介质（磁带）
    ✗ 把数据存储在离线设备上
    ✗ 删除数据，只保留 Merkle Proof（用于应付检查）

  结果：AI 训练无法进行（数据读不出来）

PoRA 的"随机访问"：
  要求：
    ✓ 快速响应随机位置的读取请求
    ✓ 必须真实存储完整数据（不能只存 Proof）
    ✓ 存储介质必须高性能（SSD，而非磁带）

  结果：保证数据真正"可用"
```

---

### 3.2.2 为什么使用 VRF（可验证随机函数）？

**VRF（Verifiable Random Function）** 是 PoRA 的关键技术。

**什么是 VRF？**

```
VRF = 一个特殊的函数，满足：

1. 输入：私钥 + 种子（Seed）
2. 输出：随机数 + 证明（Proof）
3. 性质：
   • 随机性：输出看起来随机
   • 可验证：任何人可以验证"这个随机数确实由私钥生成"
   • 唯一性：给定输入，输出唯一（不能重新生成不同结果）

公式：
  (randomness, proof) = VRF(private_key, seed)
  verify(public_key, seed, randomness, proof) → true/false
```

**为什么需要 VRF？**

```
问题 1：如果用简单随机数（如 rand()）

  矿工可以：
    ✗ 重复生成随机数，直到得到"容易"的位置
    ✗ 例如：矿工只存储了部分数据，重复随机直到命中存储的位置

  结果：作弊成功

VRF 的解决：
  ✓ 给定种子（链上公开），只能生成唯一的随机数
  ✓ 矿工无法"重新roll"
  ✓ 其他节点可以验证"这个随机数确实是矿工生成的"
```

**VRF 在 PoRA 中的应用**：

```
Step 1: 链上提供种子
  seed = hash(block_hash + miner_address + epoch)

Step 2: 矿工用私钥计算 VRF
  (random_value, vrf_proof) = VRF(miner_private_key, seed)

Step 3: 从 random_value 计算 Recall Position
  recall_position = random_value % total_sectors

Step 4: 链上验证
  verify(miner_public_key, seed, random_value, vrf_proof)
  → 确保矿工没有作弊（没有重新生成随机数）
```

**VRF 的数学保证**：

```
安全性：
  • 矿工无法预测下一个 seed（因为包含未来的 block_hash）
  • 矿工无法"试探"多个随机数（VRF 输出唯一）
  • 外部观察者可以验证矿工的随机数合法性

类比：
  VRF 就像"可验证的抽签"
  • 抽签结果是随机的
  • 但任何人都可以验证"这确实是你抽到的签"
  • 你不能重新抽签
```

---

### 3.2.3 为什么有 8TB 限制？

**8TB = 单个矿工的最大存储容量**

**问题：如果没有限制**

```
场景：大矿工 vs 小矿工

无限制情况：
  大矿工 A：1000 TB 存储
  小矿工 B：10 TB 存储

  PoRA 奖励（按存储量加权）：
    A 获得奖励概率 = 1000 / 1010 ≈ 99%
    B 获得奖励概率 = 10 / 1010 ≈ 1%

  结果：
    ✗ 小矿工几乎没有收益 → 退出市场
    ✗ 大矿工垄断 → 中心化
    ✗ 网络抗审查能力下降
```

**8TB 限制的效果**：

```
有限制情况：
  大矿工 A：想存储 1000 TB
    → 必须运行 125 个节点（1000 / 8）
    → 每个节点独立参与 PoRA

  小矿工 B：10 TB
    → 运行 2 个节点

  奖励分布：
    节点总数 = 125 + 2 = 127
    A 的节点获得奖励概率 = 125 / 127 ≈ 98.4%（接近存储占比）
    B 的节点获得奖励概率 = 2 / 127 ≈ 1.6%

  关键差异：
    ✓ A 必须部署 125 个独立节点（运维成本 ↑）
    ✓ B 只需部署 2 个节点（运维成本 ↓）
    ✓ 单位存储的运维成本：A > B（规模不经济）
    ✓ 鼓励去中心化
```

**为什么是 8TB？**

```
设计考量：

1. 硬件可达性
   • 消费级 SSD：2TB、4TB、8TB 常见
   • 服务器磁盘：8TB 价格合理
   • 太小（1TB）：碎片化严重
   • 太大（16TB）：排除小矿工

2. 网络效率
   • 8TB 数据的 Merkle 证明大小合理
   • Sealing 时间可接受（稍后详解）
   • PoRA 响应时间可控

3. 去中心化平衡
   • 足够大：单节点有一定规模经济
   • 足够小：大矿工必须多节点运营
   • 提高网络抗攻击能力

实际效果：
  8TB 节点数 ≈ 家用 NAS 存储规模
  鼓励普通用户参与挖矿
```

---

### 3.2.5 设计权衡总结

```
┌──────────────────────────────────────────────────────────┐
│                PoRA 设计权衡                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  牺牲：                        换取：                     │
│  ─────────────────────────    ─────────────────────     │
│  • 矿工需要高性能存储（SSD）  • 真正的数据可用性         │
│  • VRF 计算开销               • 防止作弊（无法重新roll） │
│  • Scratchpad 计算开销        • 防止分布式挖矿           │
│  • 8TB 限制（规模不经济）     • 去中心化（抗中心化垄断） │
│                                                          │
│  核心理念：                                              │
│  "通过精心设计的限制，激励诚实行为，                     │
│   保证数据可用性，维护网络去中心化"                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 3.3 怎么做：PoRA 六步流程详解

### 3.3.1 Step 1: 挖矿上下文获取

**从链上获取挖矿参数**

```
┌──────────────────────────────────────────────────────────┐
│                Step 1: 上下文获取                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  矿工需要从 0G Chain 获取的信息：                         │
│                                                          │
│  1. 当前 Epoch (纪元)                                    │
│     • 时间窗口（例如每 10 分钟一个 Epoch）               │
│     • 用于确定挖矿周期                                   │
│                                                          │
│  2. Latest Block Hash                                    │
│     • 作为 VRF Seed 的一部分                            │
│     • 保证随机性来源不可预测                             │
│                                                          │
│  3. Mining Difficulty                                    │
│     • 当前挖矿难度（类似 Bitcoin 的 Difficulty）        │
│     • 动态调整（根据网络总存储量）                       │
│                                                          │
│  4. Reward Parameters                                    │
│     • 当前区块奖励                                       │
│     • 奖励分配比例                                       │
│                                                          │
│  5. 矿工自身状态                                         │
│     • 已质押金额                                         │
│     • 已存储的数据量                                     │
│     • Sealed Sectors 列表                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**获取方式**：

```javascript
// 伪代码示例

// 1. 连接到 0G Chain RPC
const chain = connectToChain("https://rpc.0g.ai");

// 2. 查询当前 Epoch
const epoch = await chain.getCurrentEpoch();

// 3. 获取最新区块哈希
const latestBlock = await chain.getLatestBlock();
const blockHash = latestBlock.hash;

// 4. 查询挖矿参数
const miningParams = await chain.getMiningParameters(epoch);
// miningParams = {
//   difficulty: 1000000,
//   baseReward: "100 0G",
//   ...
// }

// 5. 查询矿工自身状态
const minerStatus = await chain.getMinerStatus(minerAddress);
// minerStatus = {
//   stakedAmount: "10000 0G",
//   storedDataSize: "5 TB",
//   sealedSectors: [...],
//   ...
// }

// 6. 构造上下文
const miningContext = {
  epoch,
  blockHash,
  miningParams,
  minerStatus,
  timestamp: Date.now()
};
```

**更新频率**：

```
上下文更新策略：

• Block Hash：每个新区块（~1秒）
• Epoch：每个 Epoch 切换（~10分钟）
• Difficulty：每个 Epoch 调整一次
• Miner Status：只在状态变化时更新（Sealing 完成、奖励领取等）

优化：
  • 缓存不变的参数（Difficulty 在 Epoch 内不变）
  • 订阅链上事件（而非轮询）
  • 使用轻节点（减少带宽）
```

---

### 3.3.2 Step 2: Nonce 计算

**Nonce = 工作量证明的一部分**

```
┌──────────────────────────────────────────────────────────┐
│                  Step 2: Nonce 计算                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  目的：增加挖矿难度，防止"免费挖矿"                      │
│                                                          │
│  计算流程：                                              │
│                                                          │
│  1. 构造输入                                             │
│     input = concat(                                      │
│       blockHash,                                         │
│       minerAddress,                                      │
│       epoch,                                             │
│       scratchpadHash  // Scratchpad 的哈希               │
│     )                                                    │
│                                                          │
│  2. 搜索 Nonce（类似 Bitcoin）                          │
│     nonce = 0                                            │
│     while True:                                          │
│       hash = SHA256(input + nonce)                       │
│       IF hash < difficulty_target:                       │
│         BREAK  // 找到有效 Nonce                        │
│       nonce += 1                                         │
│                                                          │
│  3. 输出                                                 │
│     return (nonce, hash)                                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**难度调整**：

```
Difficulty Target (难度目标)：

类似 Bitcoin：
  • target 越小，难度越高
  • 要求 hash < target

计算：
  target = MAX_HASH / difficulty

例子：
  MAX_HASH = 2^256
  difficulty = 1,000,000
  target = 2^256 / 1,000,000

  期望尝试次数 = difficulty = 1,000,000 次哈希

难度动态调整：
  IF 上一个 Epoch 平均出块时间 < 目标时间：
    difficulty *= 1.1  // 增加难度
  ELSE IF 上一个 Epoch 平均出块时间 > 目标时间：
    difficulty *= 0.9  // 降低难度
```

**Nonce 与 PoRA 的结合**：

```
为什么需要 Nonce？

问题：如果没有 Nonce
  矿工只需要：
    1. 计算 VRF（一次）
    2. 读取 Recall Position（一次）
    3. 提交证明（一次）
  → 成本极低，可能导致过度挖矿（Spam）

有 Nonce 后：
  矿工需要：
    1. 计算 VRF（一次）
    2. 搜索 Nonce（平均 difficulty 次哈希）← 增加成本
    3. 读取 Recall Position（一次）
    4. 提交证明（一次）
  → 增加挖矿成本，防止 Spam

平衡：
  • Nonce 难度不能太高（否则小矿工无法参与）
  • Nonce 难度不能太低（否则网络拥塞）
  • 动态调整确保稳定的出块速度
```

---

### 3.3.3 Step 3: VRF 计算 Recall Position

**核心步骤：从 VRF 输出确定要读取的 Sector**

```
┌──────────────────────────────────────────────────────────┐
│             Step 3: VRF 计算 Recall Position              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 构造 VRF Seed                                        │
│     seed = hash(                                         │
│       blockHash,                                         │
│       epoch,                                             │
│       minerAddress,                                      │
│       nonce  // 来自 Step 2                             │
│     )                                                    │
│                                                          │
│  2. 计算 VRF                                             │
│     (randomValue, vrfProof) = VRF_compute(               │
│       minerPrivateKey,                                   │
│       seed                                               │
│     )                                                    │
│                                                          │
│     // VRF 输出一个 256-bit 的随机数                    │
│     randomValue ∈ [0, 2^256)                            │
│                                                          │
│  3. 计算 Recall Position                                 │
│     totalSectors = minerStorageSize / 256B               │
│     // 例如：8TB / 256B = 33,554,432 Sectors            │
│                                                          │
│     recallPosition = randomValue % totalSectors          │
│                                                          │
│  4. 输出                                                 │
│     return (recallPosition, randomValue, vrfProof)       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**VRF 实现细节**：

0G 使用的 VRF 算法（推测基于标准）：**ECVRF（Elliptic Curve VRF）**

```
ECVRF 原理（简化）：

1. 密钥对
   • Private Key (SK): 椭圆曲线私钥
   • Public Key (PK): 椭圆曲线公钥 = SK * G（G 是基点）

2. VRF 计算
   hash_point = hash_to_curve(seed)  // 将 seed 映射到曲线上的点
   gamma = SK * hash_point           // 用私钥"签名"该点
   randomValue = hash(gamma)         // 从 gamma 派生随机值

3. VRF Proof
   proof = prove(SK, seed, gamma)
   // 证明"gamma 确实是用 SK 计算的"，但不泄露 SK

4. 验证
   verify(PK, seed, randomValue, proof):
     hash_point = hash_to_curve(seed)
     IF PK * hash_point == gamma_from_proof:  // 验证公式
       IF hash(gamma_from_proof) == randomValue:
         RETURN TRUE
     RETURN FALSE
```

**为什么使用椭圆曲线？**

```
优势：
  • 密钥短（256-bit 公钥，相当于 3072-bit RSA 的安全性）
  • 计算快（现代 CPU 优化）
  • 证明小（~80 bytes）

常用曲线：
  • secp256k1（Bitcoin/Ethereum 使用）
  • ed25519（更快，Solana 使用）
  • 0G 可能使用 ed25519 或 secp256k1
```

**Recall Position 的均匀性**：

```
关键性质：VRF 输出"看起来随机"

统计检验：
  • Chi-square Test：检验分布是否均匀
  • Kolmogorov-Smirnov Test：检验与均匀分布的差异

保证：
  • 任何 Sector 被选中的概率相等
  • 矿工无法预测未来的 Recall Position
  • 矿工无法"偏袒"某些 Sector（必须全部存储）
```

---

### 3.3.4 Step 4: 读取 Recalled Sector 数据

**从存储层读取实际数据**

```
┌──────────────────────────────────────────────────────────┐
│              Step 4: 读取 Recalled Sector                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 计算 Sector 的物理位置                              │
│     sectorIndex = recallPosition                         │
│     fileOffset = sectorIndex * 256B                      │
│                                                          │
│  2. 从存储介质读取                                       │
│     sectorData = storage.read(fileOffset, 256B)          │
│     // 实现层面可能有内存缓存优化，但非协议规定          │
│                                                          │
│  3. 验证数据完整性（可选，但推荐）                      │
│     expectedHash = merkleTree.getSectorHash(sectorIndex) │
│     actualHash = hash(sectorData)                        │
│     IF actualHash != expectedHash:                       │
│       ERROR: 数据损坏！                                 │
│                                                          │
│  4. 输出                                                 │
│     return sectorData (256 bytes)                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**存储性能考量**：

```
挑战：随机读取的性能要求

硬件性能：
  • HDD 随机读：~100 IOPS（每秒 I/O 操作）
    → 每次读取 ~10ms
  • SATA SSD：~10,000 IOPS
    → 每次读取 ~0.1ms
  • NVMe SSD：~100,000 IOPS
    → 每次读取 ~0.01ms

PoRA 要求：
  • 快速响应（秒级）
  • HDD 不适合（太慢）
  • 推荐 SSD（SATA 或 NVMe）

优化技巧：

1. 批量读取
   • 读取整个 Chunk (256KB) 而非单个 Sector (256B)
   • 顺序读取比随机读取快
   • 利用 OS 页缓存和预读机制

2. 文件系统优化
   • 使用 Direct I/O（绕过 OS 缓存，减少复制）
   • 使用大页内存（Huge Pages）
   • 对齐读取（4KB 边界）

3. 并行读取
   • 如果有多个磁盘，分散数据
   • 并行读取多个 Recall Position（如果需要）

4. RAID 配置
   • RAID 0：提高读取速度（但降低可靠性）
   • RAID 10：平衡速度与可靠性
```

**数据完整性验证**：

```
问题：磁盘数据可能损坏（Bit Rot、硬件故障）

方案：Merkle 证明验证

┌──────────────────────────────────────────────────────────┐
│            数据完整性验证流程                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  矿工本地存储：                                          │
│  • 数据文件（8TB 的 Sectors）                           │
│  • Merkle 树（存储所有 Sector 的哈希）                  │
│                                                          │
│  验证步骤：                                              │
│  1. 读取 sectorData                                      │
│  2. 计算 actualHash = hash(sectorData)                   │
│  3. 从 Merkle 树查询 expectedHash                        │
│  4. IF actualHash == expectedHash:                       │
│       数据完整 ✓                                         │
│     ELSE:                                                │
│       数据损坏 ✗ → 报警 + 从备份恢复                    │
│                                                          │
│  备份策略：                                              │
│  • 保留纠删码的其他分片（从其他节点恢复）               │
│  • 定期校验数据（Scrubbing）                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### 3.3.6 Step 6: PoRA Answer 提交与验证

**最终步骤：组装证明并提交到链上**

```
┌──────────────────────────────────────────────────────────┐
│           Step 6: PoRA Answer 提交与验证                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 组装 PoRA Answer                                     │
│     answer = {                                           │
│       // 挖矿上下文                                      │
│       epoch: epoch,                                      │
│       blockHash: blockHash,                              │
│       minerAddress: minerAddress,                        │
│                                                          │
│       // Nonce 相关                                      │
│       nonce: nonce,                                      │
│       nonceHash: hash_from_step2,                        │
│                                                          │
│       // VRF 相关                                        │
│       recallPosition: recallPosition,                    │
│       randomValue: randomValue,                          │
│       vrfProof: vrfProof,                                │
│                                                          │
│       // Scratchpad 相关                                 │
│       scratchpadHash: scratchpadHash,                    │
│                                                          │
│       // Recalled 数据                                   │
│       sectorData: sectorData (256 bytes),                │
│       sectorHash: hash(sectorData),                      │
│                                                          │
│       // Merkle 证明                                     │
│       merkleProof: proof_sector_to_root,                 │
│                                                          │
│       // 签名                                            │
│       signature: sign(answer, minerPrivateKey)           │
│     }                                                    │
│                                                          │
│  2. 提交到链上                                           │
│     tx = chain.submitPoRAAnswer(answer)                  │
│     await tx.wait()  // 等待确认                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**链上验证流程**：

```
┌──────────────────────────────────────────────────────────┐
│              验证者（链上智能合约）验证流程                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  验证步骤（按顺序）：                                    │
│                                                          │
│  1. 验证基本参数                                         │
│     ✓ epoch 是否为当前 epoch？                          │
│     ✓ blockHash 是否匹配？                              │
│     ✓ minerAddress 是否已注册？                         │
│                                                          │
│  2. 验证 Nonce                                           │
│     seed = hash(blockHash, minerAddress, epoch, scratchpadHash)│
│     computed_hash = hash(seed + answer.nonce)            │
│     ✓ computed_hash < difficulty_target？               │
│                                                          │
│  3. 验证 VRF                                             │
│     ✓ VRF_verify(                                       │
│         minerPublicKey,                                  │
│         seed,                                            │
│         answer.randomValue,                              │
│         answer.vrfProof                                  │
│       ) == TRUE？                                       │
│                                                          │
│  4. 验证 Recall Position                                 │
│     computed_position = answer.randomValue % totalSectors│
│     ✓ computed_position == answer.recallPosition？      │
│                                                          │
│  5. 验证 Sector Data                                     │
│     ✓ hash(answer.sectorData) == answer.sectorHash？   │
│                                                          │
│  6. 验证 Merkle Proof                                    │
│     ✓ Merkle_verify(                                    │
│         answer.sectorHash,                               │
│         answer.recallPosition,                           │
│         answer.merkleProof,                              │
│         known_merkleRoot  // 矿工注册时提交的根         │
│       ) == TRUE？                                       │
│                                                          │
│  7. 验证签名                                             │
│     ✓ verify_signature(                                 │
│         answer,                                          │
│         answer.signature,                                │
│         minerPublicKey                                   │
│       ) == TRUE？                                       │
│                                                          │
│  8. 所有验证通过 → 接受 Answer                           │
│     ✓ 记录 Answer                                       │
│     ✓ 分发奖励给矿工                                    │
│                                                          │
│  9. 任何验证失败 → 拒绝 Answer                           │
│     ✗ 不分发奖励                                        │
│     ✗ 可能惩罚（如果是恶意行为）                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**链上验证成本分析**：

```
Gas 消耗分析（以太坊为例）：

操作                          Gas 消耗（估算）
──────────────────────────────────────────
基础交易                       21,000
哈希计算 (SHA256)              ~1,000 per call
VRF 验证 (椭圆曲线)            ~50,000
Merkle 验证 (10 层)            ~10,000
签名验证 (ECDSA)               ~3,000
其他逻辑                       ~15,000
──────────────────────────────────────────
总计                           ~100,000 Gas

成本（假设 Gas Price = 50 Gwei）：
  100,000 Gas × 50 Gwei = 0.005 ETH ≈ $10

优化：
  • 批量验证（一次验证多个 Answer）
  • 使用 zkSNARK（零知识证明）压缩验证成本
  • 链下验证 + 欺诈证明（乐观验证）
```

**奖励分发**：

```
┌──────────────────────────────────────────────────────────┐
│                  奖励分发机制                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  基础奖励：                                              │
│    baseReward = BLOCK_REWARD × (minerStorage / totalNetworkStorage)│
│                                                          │
│  例子：                                                  │
│    BLOCK_REWARD = 100 0G                                 │
│    minerStorage = 8 TB                                   │
│    totalNetworkStorage = 1000 TB                         │
│    baseReward = 100 × (8/1000) = 0.8 0G                 │
│                                                          │
│  奖励调整因子：                                          │
│                                                          │
│  1. 响应速度加成                                         │
│     IF 提交时间 < 平均提交时间:                          │
│       bonus += 10%                                       │
│                                                          │
│  2. 质押加成                                             │
│     stakingBonus = min(stakedAmount / requiredStake, 1.5)│
│     // 质押越多，奖励越高（上限 1.5x）                  │
│                                                          │
│  最终奖励：                                              │
│    finalReward = baseReward × (1 + bonus) × stakingBonus│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 3.4 Sealing 机制深入

### 3.4.1 什么是 Sealing？

**Sealing（密封）** = 数据预处理与承诺

```
┌──────────────────────────────────────────────────────────┐
│                   Sealing 是什么？                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  定义：将原始数据转换为"密封"数据的过程                  │
│                                                          │
│  目的：                                                  │
│  1. 防止"外包攻击"（Outsourcing Attack）                │
│     矿工不能简单地从其他地方快速获取数据                 │
│                                                          │
│  2. 证明数据唯一性                                       │
│     每个矿工的 Sealed 数据都不同（即使原始数据相同）    │
│                                                          │
│  3. 绑定矿工身份                                         │
│     Sealed 数据与矿工私钥绑定                           │
│                                                          │
│  类比：                                                  │
│  就像给数据"盖章"，证明"这份数据属于我"                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3.4.2 Sealing 流程

```
┌──────────────────────────────────────────────────────────┐
│                  Sealing 完整流程                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  输入：                                                  │
│  • 原始数据（例如一个 AI 数据集）                       │
│  • 矿工私钥                                              │
│  • Sealing Parameters                                    │
│                                                          │
│  Step 1: 数据分片                                        │
│  ┌────────────────────────────────────────┐             │
│  │ 原始数据 → Chunks (256KB 每个)        │             │
│  │           → Sectors (256B 每个)        │             │
│  └────────────────────────────────────────┘             │
│                                                          │
│  Step 2: 为每个 Sector 计算 Replica                      │
│  ┌────────────────────────────────────────┐             │
│  │ FOR each Sector_i:                     │             │
│  │   key = KDF(minerPrivateKey, i)        │             │
│  │   // KDF = Key Derivation Function     │             │
│  │                                         │             │
│  │   sealedSector_i = Sector_i ⊕ key      │             │
│  │   // ⊕ = XOR（异或）                   │             │
│  └────────────────────────────────────────┘             │
│                                                          │
│  Step 3: 构建 Merkle 树                                  │
│  ┌────────────────────────────────────────┐             │
│  │ 对所有 sealedSector 计算哈希            │             │
│  │ 构建 Merkle 树                          │             │
│  │ 得到 Sealed Root (密封根哈希)           │             │
│  └────────────────────────────────────────┘             │
│                                                          │
│  Step 4: 提交到链上                                      │
│  ┌────────────────────────────────────────┐             │
│  │ 提交 Sealed Root                        │             │
│  │ 提交 Sealing Proof（可选，证明正确性） │             │
│  │ 注册为矿工                              │             │
│  └────────────────────────────────────────┘             │
│                                                          │
│  输出：                                                  │
│  • Sealed 数据（存储在矿工本地）                        │
│  • Sealed Root（链上承诺）                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3.4.3 为什么需要 Sealing？

**攻击场景 1：外包攻击（Outsourcing Attack）**

```
无 Sealing 的情况：

攻击者策略：
  1. 不存储任何数据
  2. 当 PoRA 要求 Recall Position 时
  3. 从公共源（IPFS、其他矿工）快速下载
  4. 提交证明
  5. 获得奖励

结果：
  ✗ 攻击者不占用存储，但获得奖励
  ✗ 破坏网络数据可用性
  ✗ "免费挖矿"

有 Sealing 的防御：

Sealed 数据 = 原始数据 ⊕ 矿工特定的 key

攻击者无法快速获取 Sealed 数据：
  • Sealed 数据对每个矿工都不同
  • 公共源只有原始数据，没有 Sealed 数据
  • 攻击者需要自己 Seal（计算 key + XOR）
    → 成本 = 存储成本

结论：Sealing 消除了外包攻击的经济激励
```

**攻击场景 2：Sybil 攻击（Sybil Attack）**

```
无 Sealing 的情况：

攻击者策略：
  1. 存储一份数据
  2. 创建 1000 个假身份（Sybil）
  3. 所有身份共享同一份数据
  4. 看起来存储了 1000 份，实际只有 1 份
  5. 获得 1000x 奖励

有 Sealing 的防御：

每个身份的 Sealed 数据都不同：
  Sealed_A = Data ⊕ KDF(PrivateKey_A, ...)
  Sealed_B = Data ⊕ KDF(PrivateKey_B, ...)
  ...

  Sealed_A ≠ Sealed_B ≠ ...

攻击者必须：
  • 为每个身份分别 Seal 数据
  • 分别存储每个 Sealed 副本
  → 成本 = 1000x 存储成本

结论：Sealing 使得 Sybil 攻击的成本等于诚实存储
```

### 3.4.4 Sealing 成本与时间

```
计算成本分析：

Sealing 一个 8TB 数据：

Step 1: KDF 计算
  • 每个 Sector 需要一次 KDF
  • 8TB / 256B = 33,554,432 Sectors
  • KDF 使用 BLAKE2（快速哈希）
  • 单核性能：~500 MB/s
  • 时间：8TB / 500MB/s ≈ 16,000 秒 ≈ 4.5 小时

Step 2: XOR 操作
  • 极快（CPU 原生指令）
  • 几乎可以忽略（相比 KDF）

Step 3: Merkle 树构建
  • 33M 个叶子节点
  • 树深度 = log2(33M) ≈ 25 层
  • 哈希计算：33M × 32 bytes ≈ 1GB 哈希数据
  • 时间：~1 小时

总计：
  Sealing 8TB 数据 ≈ 5-6 小时（单核）
  使用多核并行 ≈ 1-2 小时（8 核）

硬件要求：
  • CPU：多核（加速 Sealing）
  • 内存：至少 16GB（缓存中间结果）
  • 存储：需要 2x 空间（原始数据 + Sealed 数据）
    或边 Seal 边覆盖（更节省空间，但更慢）
```

**Sealing 的一次性成本**：

```
优势：
  • Sealing 只需要做一次（数据上传时）
  • 之后可以持续挖矿（无需重复 Seal）
  • 摊销成本低

对比 Filecoin PoRep：
  • Filecoin 需要周期性重新 Seal（或生成新证明）
  • 0G PoRA：Seal 一次，挖矿永久（直到数据删除）
```

---

## 3.5 经济模型分析

### 3.5.1 存储定价机制

**用户为存储付费，矿工获得收益**

```
┌──────────────────────────────────────────────────────────┐
│                  存储定价模型                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  定价因素：                                              │
│                                                          │
│  1. 数据大小                                             │
│     price ∝ dataSize                                     │
│                                                          │
│  2. 存储时长                                             │
│     price ∝ storageDuration                              │
│                                                          │
│  3. 网络供需                                             │
│     IF 网络存储利用率 > 80%:                            │
│       price × 1.5  // 供不应求，涨价                   │
│     ELSE IF 网络存储利用率 < 20%:                       │
│       price × 0.7  // 供过于求，降价                   │
│                                                          │
│  4. 冗余度要求                                           │
│     IF 用户要求更高冗余（例如 n/k = 20/10）:            │
│       price × (20/14)  // 标准是 14/10                  │
│                                                          │
│  定价公式（简化）：                                      │
│    price = basePrice × dataSize × duration × networkMultiplier × redundancyFactor│
│                                                          │
│  例子：                                                  │
│    存储 1TB 数据，1 年                                   │
│    basePrice = $0.001 per GB per month                   │
│    price = 0.001 × 1000 GB × 12 months × 1.0 × 1.0      │
│         = $12 per year                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**对比传统云存储**：

| 服务 | 价格（1TB/年） | 备注 |
|------|---------------|------|
| **AWS S3** | ~$276 | 标准存储 |
| **Google Cloud** | ~$240 | Nearline 存储 |
| **Arweave** | ~$1000+ | 永久存储（一次性） |
| **Filecoin** | ~$20-50 | 去中心化存储 |
| **0G Storage** | **~$10-30** | **去中心化 + AI 优化** |

0G 的成本优势：
- 去中心化降低运营成本
- PoRA 激励优化存储效率
- 纠删码减少冗余（相比简单复制）

---

### 3.5.2 挖矿奖励计算

**矿工的收益来源**

```
┌──────────────────────────────────────────────────────────┐
│                  矿工收益模型                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  收益来源：                                              │
│                                                          │
│  1. Block Reward（区块奖励）                             │
│     • 来自代币增发（通胀）                              │
│     • 按存储量比例分配                                  │
│     • 随时间递减（类似 Bitcoin Halving）               │
│                                                          │
│  2. Storage Fees（存储费用）                             │
│     • 用户支付的存储费用                                │
│     • 分配给存储相应数据的矿工                          │
│                                                          │
│  3. Retrieval Fees（检索费用）                           │
│     • 用户下载数据时支付                                │
│     • 快速响应获得更高费用                              │
│                                                          │
│  总收益：                                                │
│    totalReward = blockReward + storageFees + retrievalFees│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Block Reward 分配**：

```
单个矿工的 Block Reward：

minerReward = TOTAL_BLOCK_REWARD × (minerStorage / totalNetworkStorage)

例子：
  TOTAL_BLOCK_REWARD = 100 0G per block
  矿工存储 = 8 TB
  全网存储 = 1000 TB

  minerReward = 100 × (8 / 1000) = 0.8 0G per block

年化收益估算：
  区块时间 = 1 秒
  年区块数 = 365 × 24 × 3600 = 31,536,000
  矿工年收益 = 0.8 × 31,536,000 = 25,228,800 0G

  假设 0G 价格 = $0.1
  年收益 = $2,522,880

  成本（8TB SSD 矿机 + 电费）：
    硬件：$2000
    电费：$500/年
    总成本：$2500

  ROI = (2,522,880 - 2500) / 2500 ≈ 100,000%（显然这是简化模型）

实际情况：
  • 代币价格波动
  • 网络存储量增长 → 单个矿工占比下降
  • 通胀递减（区块奖励减半）
```

**Storage Fees 分配**：

```
用户存储 1TB 数据，支付 $12/年

分配给哪些矿工？
  • 假设纠删码 n=14，数据分成 14 份
  • 14 个不同的矿工各存储一份
  • 每个矿工获得：$12 / 14 ≈ $0.86/年

优化：
  • 矿工存储更多数据 → 获得更多 Storage Fees
  • 热门数据（高检索频率）→ 获得更多 Retrieval Fees
```

---

### 3.5.3 惩罚机制（Slashing）

**防止矿工恶意行为**

```
┌──────────────────────────────────────────────────────────┐
│                  惩罚机制（Slashing）                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  可惩罚行为：                                            │
│                                                          │
│  1. 提交虚假 PoRA Answer                                 │
│     • 检测：验证失败                                    │
│     • 惩罚：削减 10% 质押                               │
│                                                          │
│  2. 数据丢失（无法提供 Sector）                         │
│     • 检测：多次 PoRA 失败                              │
│     • 惩罚：削减 5% 质押 + 强制退出                     │
│                                                          │
│  3. 长期离线（不参与 PoRA）                             │
│     • 检测：连续 N 个 Epoch 无提交                      │
│     • 惩罚：削减 1% 质押 + 暂停奖励                     │
│                                                          │
│  4. 双重承诺（同一数据多次 Seal）                       │
│     • 检测：Sealed Root 重复                            │
│     • 惩罚：削减 20% 质押 + 永久封禁                    │
│                                                          │
│  质押要求：                                              │
│    最小质押 = 预期年收益 × 0.5                          │
│    目的：确保惩罚足够威慑                                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**惩罚资金去向**：

```
Slashed 代币的分配：

1. 50% → 销毁（Burn）
   • 减少总供应量
   • 提升代币价值

2. 30% → 奖励池
   • 补偿诚实矿工

3. 20% → 治理金库
   • 用于网络发展
```

---

### 3.5.4 供需平衡

**网络自我调节机制**

```
┌──────────────────────────────────────────────────────────┐
│              存储供需平衡机制                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  场景 1：供过于求（网络利用率低）                        │
│                                                          │
│    现状：                                                │
│    • 矿工多，数据少                                     │
│    • 矿工收益低                                         │
│                                                          │
│    自动调节：                                            │
│    • 存储价格下降 → 吸引更多用户                        │
│    • 部分矿工退出（收益不足） → 减少供应               │
│    • 达到新平衡                                         │
│                                                          │
│  场景 2：供不应求（网络利用率高）                        │
│                                                          │
│    现状：                                                │
│    • 用户多，存储容量不足                               │
│    • 矿工收益高                                         │
│                                                          │
│    自动调节：                                            │
│    • 存储价格上涨 → 激励更多矿工加入                    │
│    • 部分用户减少使用 → 减少需求                        │
│    • 达到新平衡                                         │
│                                                          │
│  长期趋势：                                              │
│    随着网络成熟，供需波动减小，价格稳定                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 3.6 本章总结

### 核心要点回顾

```
┌───────────────────────────────────────────────────────────┐
│                PoRA 机制核心设计                          │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  【是什么】                                               │
│  • 随机访问证明（Proof of Random Access）                │
│  • 证明矿工真实存储数据且可快速访问                       │
│                                                           │
│  【为什么】                                               │
│  • VRF：防止矿工作弊（重新 roll 随机数）                 │
│  • Scratchpad：防止分布式挖矿（绑定计算与存储）          │
│  • 8TB 限制：鼓励去中心化（抗中心化垄断）                │
│  • Sealing：防止外包攻击和 Sybil 攻击                    │
│                                                           │
│  【怎么做】                                               │
│  六步流程：                                               │
│    1. 获取上下文（Epoch, BlockHash, Difficulty）         │
│    2. 计算 Nonce（PoW，增加挖矿成本）                    │
│    3. VRF 计算 Recall Position（随机选择位置）           │
│    4. 读取 Recalled Sector（从存储介质读取）             │
│    5. 生成 Scratchpad 并混合数据（防分布式挖矿）         │
│    6. 提交 Answer + 链上验证（Merkle Proof）             │
│                                                           │
│  【经济模型】                                             │
│  • 收益：Block Reward + Storage Fees + Retrieval Fees    │
│  • 惩罚：虚假证明、数据丢失、长期离线                     │
│  • 供需平衡：价格自动调节                                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### 与其他章节的联系

```
本章（PoRA 激励机制）
    │
    ├─ 在 Sector 级别工作 → Chapter 2 (Storage 架构)
    ├─ 依赖 Chain 提供随机性源 → Chapter 1 (0G Chain)
    ├─ 为 Storage 节点提供激励 → Chapter 2
    └─ 经济模型影响生态发展 → Chapter 9 (对比分析)
```

### 思考题

1. **VRF vs 普通随机数**：如果不使用 VRF，而是用链上随机数（例如 block.timestamp），会有什么安全风险？
2. **Scratchpad 作用**：Scratchpad 是如何防止矿工将存储和计算分离到不同机器的？为什么 256KB 的大小是合适的？
3. **8TB 限制权衡**：如果限制改为 16TB 或 4TB，会对去中心化有什么影响？
4. **Sealing 成本**：Sealing 需要 5-6 小时，这是否会成为小矿工的进入门槛？如何优化？

---

**下一章预告**：我们将深入 **0G DA（数据可用性层）**，理解 Quorum 机制、数据分区、BLS 聚合签名如何实现"无限扩展"的数据可用性。

