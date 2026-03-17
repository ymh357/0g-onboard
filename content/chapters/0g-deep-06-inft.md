# 6. INFT（智能NFT）深度解析

## 本章导读

INFT（Intelligent NFT）基于 ERC-7857 标准，是下一代 NFT 的代表，具备多模态、生成性、交互性、动态性四大特征。本章将深入剖析 INFT 的技术实现与应用场景。

**学习目标**：
- 理解传统 NFT 的局限性
- 掌握 ERC-7857 标准的四个关键特性
- 深入理解 INFT 的技术实现
- 分析 INFT 与 0G 生态的集成
- 探索 INFT 的创新应用场景

---

## 6.1 是什么：INFT 与传统 NFT

### 6.1.1 传统 NFT 的局限

```
┌──────────────────────────────────────────────────────────┐
│           传统 NFT（ERC-721）的限制                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 静态内容                                             │
│     • 元数据固定（tokenURI 不变）                       │
│     • 图片/视频静态                                     │
│     • 无法演化                                          │
│                                                          │
│  2. 单一模态                                             │
│     • 通常只有图片或视频                                │
│     • 无法同时包含文本、音频、3D 等                     │
│                                                          │
│  3. 无交互性                                             │
│     • NFT 不能"响应"用户行为                            │
│     • 不能根据环境变化                                  │
│                                                          │
│  4. 无生成能力                                           │
│     • 内容由创作者预先制作                              │
│     • NFT 本身不能生成新内容                            │
│                                                          │
│  例子：传统 NFT                                          │
│  • 一张静态猴子图片（BAYC）                             │
│  • 永远不会改变                                         │
│  • 无法与持有者互动                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.1.2 INFT 的四个关键特性

**ERC-7857 标准定义**：

```
┌──────────────────────────────────────────────────────────┐
│              INFT 四大特性                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. Multimodality（多模态）                              │
│     • 同时包含图片、文本、音频、3D、视频                │
│     • 跨模态融合                                        │
│                                                          │
│  2. Generativity（生成性）                               │
│     • 内置 AI 模型                                      │
│     • 可以生成新内容                                    │
│     • 持续创作                                          │
│                                                          │
│  3. Interactivity（交互性）                              │
│     • 响应用户输入                                      │
│     • 根据链上事件变化                                  │
│     • 与其他 NFT 互动                                   │
│                                                          │
│  4. Dynamic（动态性）                                    │
│     • 状态随时间演化                                    │
│     • 元数据可更新                                      │
│     • 历史可追溯                                        │
│                                                          │
│  例子：AI 艺术 INFT                                      │
│  • 持有者提问 → INFT 生成艺术作品                       │
│  • 根据持有时长演化风格                                 │
│  • 与其他 INFT 碰撞产生"子代"                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 6.2 为什么：INFT 的设计哲学

### 6.2.1 为什么需要多模态（Multimodality）？

```
问题：单一模态表达能力有限

例子：音乐 NFT（传统）
  • 只有音频文件
  • 无法附带歌词、乐谱、MV

INFT 方案：
  • 音频 + 歌词（文本）+ MV（视频）+ 3D 虚拟演唱会
  • 持有者可以选择不同模态体验
  • 跨模态联动（音乐节奏 → 视觉效果）

实现：
  metadata = {
    image: "ipfs://...",
    audio: "0g://...",
    video: "0g://...",
    text: "Lyrics...",
    model_3d: "0g://..."
  }
```

### 6.2.2 为什么需要生成性（Generativity）？

```
价值：NFT 本身成为"创作者"

传统 NFT：
  创作者制作 → 用户购买 → 静态持有

INFT：
  创作者提供"种子" → INFT 持续生成 → 用户获得持续价值

例子：AI 画家 INFT
  • 内置 Stable Diffusion 模型
  • 持有者输入 prompt → INFT 生成新画作
  • 每天生成一幅独特作品
  • 持有者拥有所有生成作品的版权

技术栈：
  • AI 模型存储在 0G Storage
  • 推理通过 0G Compute
  • 生成历史记录在链上
```

### 6.2.3 为什么需要交互性（Interactivity）？

```
价值：NFT 不再是"死"的资产

交互类型：

1. 用户交互
   • 持有者发送消息 → INFT 回复
   • 持有者设定参数 → INFT 改变外观

2. 链上事件交互
   • ETH 价格变化 → INFT 表情变化
   • 持有时间 → INFT 等级提升

3. NFT 间交互
   • 两个 INFT "相遇" → 产生新 INFT
   • 组合 INFT → 解锁隐藏功能

例子：虚拟宠物 INFT
  • 持有者"喂食"（链上交易）→ 宠物成长
  • 长时间不互动 → 宠物"饥饿"
  • 与其他宠物 INFT 交配 → 生成子代
```

### 6.2.4 为什么需要动态性（Dynamic）？

```
价值：NFT 有生命周期，持续演化

动态类型：

1. 时间驱动
   • 每天变化外观
   • 季节性主题
   • 持有时长 → 稀有度提升

2. 事件驱动
   • 完成成就 → 解锁新特性
   • 市场波动 → 数据可视化更新

3. 社区驱动
   • 持有者投票 → 改变 INFT 发展方向
   • 社区活跃度 → INFT 等级

例子：进化型 NFT
  • 初始：普通卡片
  • 1个月后：解锁动画
  • 3个月后：解锁 3D 模型
  • 6个月后：解锁 AI 对话功能
  • 1年后：成为"传说"级别，可繁殖
```

---

## 6.3 为什么需要 0G：INFT 的基础设施挑战

### 6.3.1 传统区块链无法支持 INFT

```
┌──────────────────────────────────────────────────────────┐
│            INFT 的三大基础设施需求                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  需求 1：大文件存储                                      │
│  ─────────────────                                       │
│    INFT 需要存储：                                       │
│    • AI 模型文件（几 GB 到几十 GB）                     │
│    • 多模态内容（图片、视频、3D、音频）                 │
│    • 生成历史记录                                       │
│                                                          │
│    传统方案问题：                                        │
│    ✗ 链上存储：成本天价（1 GB ≈ 几万美元）             │
│    ✗ IPFS：                                             │
│      - 无激励机制，文件可能丢失                         │
│      - 性能差（几 MB/s）                                │
│      - 无法保证长期可用性                               │
│    ✗ 中心化云存储（AWS S3）：                           │
│      - 违背去中心化原则                                 │
│      - 单点故障                                         │
│      - 可以随时删除你的文件                             │
│                                                          │
│  需求 2：AI 计算                                         │
│  ─────────────                                           │
│    INFT 需要：                                           │
│    • 运行 AI 模型推理（生成内容）                       │
│    • GPU 算力                                           │
│    • 可验证性（证明计算正确执行）                       │
│                                                          │
│    传统方案问题：                                        │
│    ✗ 链上计算：Gas 费爆炸（AI 推理太复杂）              │
│    ✗ 中心化服务器：                                     │
│      - 用户必须信任服务器                               │
│      - 无法验证结果正确性                               │
│      - 服务器可以作弊（返回假结果）                     │
│    ✗ Chainlink Functions：                              │
│      - 成本高                                           │
│      - 不支持 GPU 密集型任务                            │
│                                                          │
│  需求 3：数据可用性                                      │
│  ─────────────────                                       │
│    INFT 需要：                                           │
│    • 持续访问 AI 模型和内容                             │
│    • 验证数据确实存在且可下载                           │
│    • 历史记录不可篡改                                   │
│                                                          │
│    传统方案问题：                                        │
│    ✗ 无法证明数据可用性                                 │
│    ✗ 无法防止数据被删除或篡改                           │
│    ✗ 无法追溯历史版本                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.3.2 0G 如何解决这些问题

```
┌──────────────────────────────────────────────────────────┐
│            0G 三层架构完美匹配 INFT 需求                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  0G Storage 层 → 解决大文件存储                          │
│  ────────────────────────────────────                    │
│    ✓ 低成本：比以太坊便宜 1000 倍+                       │
│    ✓ 高性能：50 GB/s 吞吐量                              │
│    ✓ 去中心化：矿工网络，无单点故障                     │
│    ✓ 激励机制：PoRA 保证长期存储                        │
│    ✓ 可验证：Merkle Proof 验证数据完整性                │
│                                                          │
│    INFT 使用：                                           │
│    • AI 模型存储：llama-3-8b.safetensors (16 GB)        │
│    • 多模态内容：video.mp4 (2 GB), 3d_model.glb (500MB) │
│    • 生成历史：每次生成的作品永久保存                   │
│                                                          │
│    成本对比：                                            │
│    • 以太坊：16 GB ≈ $320,000（$20,000/GB）             │
│    • IPFS：免费，但无保证                                │
│    • 0G Storage：16 GB ≈ $16（$1/GB/年）                │
│                                                          │
│  ────────────────────────────────────────────           │
│                                                          │
│  0G DA 层 → 解决数据可用性验证                           │
│  ─────────────────────────────────                       │
│    ✓ 即时验证：证明数据已发布且可下载                   │
│    ✓ 防篡改：Quorum 签名确保数据完整性                  │
│    ✓ 历史追溯：每次更新都有 DA 证明                     │
│                                                          │
│    INFT 使用：                                           │
│    • 发布新模型 → DA 层验证可用性                       │
│    • 更新 INFT 状态 → DA 层记录变更                     │
│    • 生成内容 → DA 层证明生成事件                       │
│                                                          │
│    防作弊：                                              │
│    • 创作者无法事后删除已发布的内容                     │
│    • INFT 持有者可以验证历史记录真实性                  │
│    • 争议解决：DA 层作为不可篡改的证据                  │
│                                                          │
│  ────────────────────────────────────────────           │
│                                                          │
│  0G Compute 层 → 解决 AI 计算                            │
│  ──────────────────────────                              │
│    ✓ 去中心化算力：Provider 网络提供 GPU                │
│    ✓ 可验证性：TEE + Remote Attestation                 │
│    ✓ 低成本：比中心化云便宜 50%+                        │
│    ✓ 隐私保护：TEE 保护模型和数据                       │
│                                                          │
│    INFT 使用：                                           │
│    • 推理请求：用户 prompt → Compute 推理 → 返回结果    │
│    • 可验证性：TEE 证明确保结果真实                     │
│    • 模型更新：微调 AI 模型（训练服务）                 │
│                                                          │
│    信任保证：                                            │
│    • Provider 无法作弊（TEE + code_hash 验证）          │
│    • 用户无需信任单一服务器                             │
│    • 结果可以被任何人验证                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.3.3 完整工作流程：INFT × 0G

```
┌──────────────────────────────────────────────────────────┐
│            案例：AI 画家 INFT 完整生命周期                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  阶段 1：INFT 创建                                       │
│  ────────────────                                        │
│    创作者准备：                                          │
│    1. 训练 AI 模型（Stable Diffusion 微调版）           │
│    2. 上传模型到 0G Storage                              │
│       ├─ model.safetensors (4 GB)                        │
│       ├─ config.json                                     │
│       └─ tokenizer files                                 │
│    3. 获得存储哈希：0g://model_abc123                    │
│                                                          │
│    链上铸造 INFT：                                       │
│    INFTContract.mint({                                   │
│      name: "AI Painter #1",                              │
│      aiModel: "0g://model_abc123",                       │
│      modelType: "stable-diffusion-v2.1",                 │
│      capabilities: ["text-to-image", "style-transfer"]   │
│    })                                                    │
│                                                          │
│    DA 层记录：                                           │
│    • 发布事件：INFT #1 创建                              │
│    • 模型哈希：abc123...                                 │
│    • 创建时间：2024-01-01 12:00:00                       │
│    • 不可篡改，永久可追溯                                │
│                                                          │
│  阶段 2：用户生成内容                                    │
│  ───────────────────                                     │
│    用户调用：                                            │
│    INFT.generate(tokenId: 1, prompt: "sunset over ocean")│
│                                                          │
│    Step 1: 链上触发事件                                  │
│      event GenerateRequest(                              │
│        tokenId: 1,                                       │
│        prompt: "sunset over ocean",                      │
│        requester: 0xUser...                              │
│      )                                                   │
│                                                          │
│    Step 2: 0G Compute 监听并执行                         │
│      • Provider 监听链上事件                             │
│      • 从 0G Storage 下载模型（0g://model_abc123）      │
│      • 在 TEE 中加载模型                                 │
│      • 执行推理：generate("sunset over ocean")           │
│      • 生成图片：image_output.png                        │
│      • 上传图片到 0G Storage                             │
│      • 生成 TEE Attestation（证明）                      │
│                                                          │
│    Step 3: 提交结果到链上                                │
│      submitGeneration({                                  │
│        tokenId: 1,                                       │
│        resultHash: "0g://image_xyz789",                  │
│        attestation: TEE_proof,                           │
│        metadata: {resolution: "1024x1024", ...}          │
│      })                                                  │
│                                                          │
│    Step 4: 链上验证与记录                                │
│      • 验证 TEE Attestation ✓                            │
│      • 更新 INFT 状态：                                  │
│        generationHistory[1].push({                       │
│          prompt: "sunset over ocean",                    │
│          output: "0g://image_xyz789",                    │
│          timestamp: block.timestamp                      │
│        })                                                │
│      • 发出事件：GenerationCompleted                     │
│                                                          │
│    Step 5: DA 层记录（可选，增强安全）                   │
│      • 生成事件提交到 DA 层                              │
│      • Quorum 签名验证                                   │
│      • 永久证明：INFT #1 在某时刻生成了某内容            │
│                                                          │
│  阶段 3：INFT 演化                                       │
│  ─────────────────                                       │
│    场景：持有者使用 100 次后，INFT 升级                  │
│                                                          │
│    自动触发（Chainlink Automation）：                    │
│    function checkUpkeep() returns (bool) {               │
│      return generationCount[tokenId] >= 100;             │
│    }                                                     │
│                                                          │
│    function performUpkeep() {                            │
│      // 升级 INFT 等级                                  │
│      level[tokenId] += 1;                                │
│                                                          │
│      // 解锁新功能                                       │
│      if (level[tokenId] == 2) {                          │
│        unlockCapability(tokenId, "image-to-image");      │
│      }                                                   │
│                                                          │
│      // 微调 AI 模型（可选）                            │
│      requestModelFineTune({                              │
│        baseModel: "0g://model_abc123",                   │
│        trainingData: generationHistory[tokenId],         │
│        targetStyle: "user_preferred_style"               │
│      });                                                 │
│    }                                                     │
│                                                          │
│    微调完成后：                                          │
│    • 新模型上传到 0G Storage                             │
│    • 更新 INFT 的 aiModel 指针                           │
│    • DA 层记录升级事件                                   │
│                                                          │
│  阶段 4：INFT 交易                                       │
│  ─────────────────                                       │
│    买家验证 INFT：                                       │
│    1. 检查链上记录：                                     │
│       • 生成历史：100+ 作品                              │
│       • 等级：2 级                                       │
│       • 能力：text-to-image, image-to-image              │
│                                                          │
│    2. 验证 DA 层：                                       │
│       • 所有生成事件都有 DA 证明 ✓                      │
│       • 历史记录未被篡改 ✓                              │
│                                                          │
│    3. 验证 0G Storage：                                  │
│       • 模型文件存在 ✓                                   │
│       • 所有生成作品可下载 ✓                            │
│                                                          │
│    信任购买：                                            │
│    • 买家无需信任卖家                                   │
│    • 所有历史记录可验证                                 │
│    • AI 模型和内容永久可用                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.3.4 为什么 INFT 离不开 0G？

```
┌──────────────────────────────────────────────────────────┐
│            INFT 的核心价值依赖 0G                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 经济可行性                                           │
│  ──────────────                                          │
│     没有 0G Storage：                                    │
│     • 存储成本天价，INFT 无法规模化                     │
│     • 例子：存储一个 AI 模型 = $320,000（以太坊）       │
│                                                          │
│     有 0G Storage：                                      │
│     • 成本降低 1000 倍+                                  │
│     • INFT 创作者和用户都能负担                         │
│                                                          │
│  2. 功能完整性                                           │
│  ──────────────                                          │
│     没有 0G Compute：                                    │
│     • INFT 无法真正"生成"内容                           │
│     • 必须依赖中心化服务器（违背 Web3 原则）            │
│     • 无法验证生成结果的真实性                          │
│                                                          │
│     有 0G Compute：                                      │
│     • 去中心化 AI 推理                                  │
│     • TEE 保证结果可验证                                │
│     • INFT 真正实现"智能"                               │
│                                                          │
│  3. 信任最小化                                           │
│  ──────────────                                          │
│     没有 0G DA：                                         │
│     • 无法证明 INFT 历史的真实性                        │
│     • 创作者可以事后篡改记录                            │
│     • 买家无法验证 INFT 的价值                          │
│                                                          │
│     有 0G DA：                                           │
│     • 所有事件有不可篡改的证明                          │
│     • 完全透明，任何人可验证                            │
│     • 建立去中心化信任                                  │
│                                                          │
│  4. 长期可用性                                           │
│  ──────────────                                          │
│     没有 0G：                                            │
│     • IPFS 无激励，文件可能丢失                         │
│     • 中心化服务随时可能关闭                            │
│     • INFT 变成"死"资产                                 │
│                                                          │
│     有 0G：                                              │
│     • PoRA 激励确保长期存储                             │
│     • 去中心化网络，无单点故障                          │
│     • INFT 永久可用                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.3.5 对比：有 0G vs 无 0G

```
┌──────────────────────────────────────────────────────────┐
│            INFT 实现方案对比                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  方案 A：无 0G（传统方案）                               │
│  ─────────────────────────                               │
│    架构：                                                │
│    • 存储：IPFS（无激励）+ AWS S3（中心化备份）        │
│    • 计算：中心化 API 服务器                            │
│    • 验证：信任服务器                                   │
│                                                          │
│    问题：                                                │
│    ✗ 存储不可靠：IPFS 文件可能丢失                      │
│    ✗ 中心化风险：AWS 单点故障                           │
│    ✗ 无法验证：必须信任 API 服务器                      │
│    ✗ 隐私泄露：服务器可以看到所有数据                   │
│    ✗ 成本高：运营服务器 + 云存储费用                    │
│    ✗ 审查风险：AWS 可以删除内容                         │
│                                                          │
│    结果：                                                │
│    • "伪去中心化" NFT                                   │
│    • 长期可用性无保证                                   │
│    • 用户必须信任项目方                                 │
│                                                          │
│  ────────────────────────────────────────────           │
│                                                          │
│  方案 B：集成 0G（理想方案）                             │
│  ───────────────────────                                 │
│    架构：                                                │
│    • 存储：0G Storage（去中心化 + 激励）                │
│    • 计算：0G Compute（TEE + 可验证）                   │
│    • 验证：0G DA（数据可用性证明）                      │
│                                                          │
│    优势：                                                │
│    ✓ 存储可靠：PoRA 激励 + 去中心化                     │
│    ✓ 去中心化：无单点故障                               │
│    ✓ 可验证：TEE + DA 证明                              │
│    ✓ 隐私保护：TEE 加密计算                             │
│    ✓ 成本低：去中心化降低成本                           │
│    ✓ 抗审查：无人能删除内容                             │
│                                                          │
│    结果：                                                │
│    • 真正的去中心化智能 NFT                             │
│    • 长期可用性有保证                                   │
│    • 完全信任最小化                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**核心结论**：

> **INFT 的四大特性（多模态、生成性、交互性、动态性）在技术上都依赖于：**
> - **0G Storage**：存储 AI 模型和多模态内容
> - **0G Compute**：执行 AI 推理和生成
> - **0G DA**：验证数据可用性和历史真实性
>
> **没有 0G，INFT 要么成本天价（链上存储），要么沦为中心化方案（AWS），无法实现真正的去中心化智能 NFT。**

---

## 6.4 怎么做：INFT 技术实现

### 6.4.1 ERC-7857 智能合约结构

```solidity
// ERC-7857 标准接口（简化）
interface IERC7857 {
    // 基础 ERC-721
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;

    // INFT 扩展

    // 1. 多模态内容
    function getContent(uint256 tokenId, string memory modality)
        external view returns (string memory);
    // modality: "image", "audio", "video", "text", "3d"

    // 2. 生成功能
    function generate(uint256 tokenId, string memory prompt)
        external returns (bytes memory output);

    // 3. 交互功能
    function interact(uint256 tokenId, bytes memory input)
        external returns (bytes memory response);

    // 4. 动态状态
    function getState(uint256 tokenId)
        external view returns (bytes memory state);

    function setState(uint256 tokenId, bytes memory newState)
        external;  // 仅owner或授权地址

    // 元数据
    function getMetadata(uint256 tokenId)
        external view returns (InftMetadata memory);
}

struct InftMetadata {
    string name;
    string description;
    string[] modalities;      // 支持的模态
    address aiModel;          // AI 模型地址（0G Storage）
    uint256 version;          // 版本号
    uint256 createdAt;        // 创建时间
    uint256 updatedAt;        // 更新时间
    bytes customData;         // 自定义数据
}
```

### 6.4.2 AI 模型集成

**存储方案**：

```
┌──────────────────────────────────────────────────────────┐
│            INFT AI 模型存储架构                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 模型文件存储在 0G Storage                            │
│     • 模型权重（几GB）                                  │
│     • 推理代码                                          │
│     • 配置文件                                          │
│                                                          │
│  2. 链上记录模型哈希                                     │
│     aiModel = {                                          │
│       storageHash: "0g://model_abc123",                  │
│       modelType: "stable-diffusion-v2",                  │
│       version: "2.1",                                    │
│       merkleRoot: "0xabc..."  // 防篡改                 │
│     }                                                    │
│                                                          │
│  3. 推理执行                                             │
│     INFT.generate() 调用 →                              │
│     链上触发事件 →                                       │
│     0G Compute Provider 监听 →                          │
│     加载模型（从 0G Storage）→                          │
│     执行推理（在 TEE）→                                 │
│     返回结果 + Attestation →                            │
│     链上验证 + 存储结果                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**推理流程**：

```
用户调用 INFT.generate("a sunset"):

Step 1: 链上记录请求
  event GenerateRequest(
    uint256 tokenId,
    string prompt,
    address requester
  );

Step 2: 0G Compute 监听事件
  compute_provider.on("GenerateRequest", async (event) => {
    // 加载 INFT 的 AI 模型
    model = await load_model_from_0g(event.tokenId);

    // 执行推理（TEE）
    result = model.generate(event.prompt);

    // 生成证明
    attestation = TEE.attest(result);

    // 提交结果
    submit_result(event.tokenId, result, attestation);
  });

Step 3: 链上验证与存储
  function submitGeneration(
    uint256 tokenId,
    bytes result,
    bytes attestation
  ) external {
    require(verify_attestation(attestation));

    // 存储生成结果
    generations[tokenId].push(result);

    // 更新 INFT 状态
    _setState(tokenId, result);

    emit GenerationCompleted(tokenId, result);
  }
```

### 6.4.3 动态行为实现

**状态机设计**：

```
┌──────────────────────────────────────────────────────────┐
│            INFT 状态机示例（虚拟宠物）                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  状态变量：                                              │
│  struct PetState {                                       │
│    uint256 level;         // 等级 (1-100)               │
│    uint256 happiness;     // 快乐度 (0-100)             │
│    uint256 hunger;        // 饥饿度 (0-100)             │
│    uint256 lastFed;       // 上次喂食时间               │
│    uint256 experience;    // 经验值                     │
│    string mood;           // 心情: "happy", "sad", etc  │
│  }                                                       │
│                                                          │
│  状态转换：                                              │
│                                                          │
│  feed() → hunger -= 20, happiness += 10                 │
│  play() → happiness += 15, hunger += 5                  │
│  evolve() → level += 1 (if experience > threshold)      │
│  decay() → hunger += 1 per hour (自动)                  │
│                                                          │
│  自动触发（Chainlink Automation）：                      │
│  function upkeep() external {                            │
│    uint256 timePassed = block.timestamp - lastUpdate;   │
│    hunger += timePassed / 3600;  // 每小时 +1           │
│    if (hunger > 80) mood = "sad";                       │
│    if (hunger < 20) mood = "happy";                     │
│  }                                                       │
│                                                          │
│  可视化生成：                                            │
│  function render() returns (string memory svg) {         │
│    // 根据状态生成不同外观                              │
│    if (mood == "happy") {                                │
│      return generate_happy_svg(level, ...);             │
│    } else {                                              │
│      return generate_sad_svg(level, ...);               │
│    }                                                     │
│  }                                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.4.4 NFT 间交互

**跨 INFT 通信**：

```
场景：两个 INFT "繁殖"生成新 INFT

function breed(uint256 tokenId1, uint256 tokenId2)
    external
    returns (uint256 newTokenId)
{
    require(ownerOf(tokenId1) == msg.sender);
    require(ownerOf(tokenId2) == msg.sender);

    // 获取父代基因（状态）
    bytes memory gene1 = getState(tokenId1);
    bytes memory gene2 = getState(tokenId2);

    // 基因混合（链下计算，链上验证）
    bytes memory childGene = mixGenes(gene1, gene2);

    // 铸造新 INFT
    newTokenId = _mint(msg.sender);
    setState(newTokenId, childGene);

    // 记录家谱
    family[newTokenId] = Family({
        parent1: tokenId1,
        parent2: tokenId2,
        generation: max(
            family[tokenId1].generation,
            family[tokenId2].generation
        ) + 1
    });

    emit Bred(tokenId1, tokenId2, newTokenId);
}

// 基因混合（示例：简化版）
function mixGenes(bytes gene1, bytes gene2)
    internal pure returns (bytes memory)
{
    // 随机选择特征
    uint256 random = uint256(keccak256(abi.encode(gene1, gene2)));

    bytes memory mixed;
    for (uint i = 0; i < gene1.length; i++) {
        if (random & (1 << i) != 0) {
            mixed[i] = gene1[i];  // 继承父1
        } else {
            mixed[i] = gene2[i];  // 继承父2
        }
    }

    // 突变（1%概率）
    if (random % 100 == 0) {
        mixed[random % mixed.length] = bytes1(uint8(random >> 8));
    }

    return mixed;
}
```

---

## 6.5 应用场景

### 6.5.1 AI 艺术品

```
AI 画家 INFT：

特性：
  • 持有者输入 prompt → 生成画作
  • 每天自动创作一幅作品（根据新闻、天气等）
  • 风格随持有时长演化（新手 → 大师）
  • 可与其他 AI 画家 INFT "合作"创作

商业模式：
  • 持有者拥有所有生成作品的版权
  • 可以出售单幅作品为独立 NFT
  • INFT 本身可以升值（作品越多越值钱）

实现：
  • AI 模型：Stable Diffusion（存储在 0G Storage）
  • 推理：0G Compute
  • 作品存储：0G Storage
  • 版权登记：链上记录
```

### 6.5.2 游戏道具

```
进化型装备 INFT：

特性：
  • 根据玩家使用频率升级
  • 击败 Boss → 解锁新技能
  • 装备间可以"熔炼"合成
  • 稀有装备有独特 AI 对话

游戏集成：
  • 链上记录使用次数
  • 链下游戏逻辑 + 链上状态同步
  • 跨游戏互通（同一 INFT 在多个游戏中使用）

例子：
  初始：普通剑（攻击+10）
  100次战斗后：锋利剑（攻击+20，暴击+5%）
  击败龙后：屠龙剑（攻击+50，对龙伤害 x2）
  与盾牌 INFT 组合：套装效果（防御+30）
```

### 6.5.3 数字身份

```
自主 AI Agent INFT：

特性：
  • 代表持有者的"数字分身"
  • 可以自主执行任务（交易、社交等）
  • 学习持有者行为模式
  • 隐私保护（TEE 内运行）

应用：
  • 自动化 DeFi 策略（AI 交易员）
  • 社交网络代理（自动回复、发帖）
  • 虚拟秘书（日程管理、提醒）

安全：
  • 持有者设定权限范围
  • 重要决策需要人工确认
  • 所有行为可追溯
```

### 6.5.4 教育与培训

```
个性化导师 INFT：

特性：
  • 根据学生水平调整教学内容
  • 追踪学习进度
  • 生成个性化练习题
  • 提供实时答疑

实现：
  • 内置教育 AI 模型
  • 学习数据加密存储
  • 成绩记录链上（不可篡改）
  • 可转让（毕业后卖给下一届学生，保留部分学习数据）

价值：
  • 永久持有的"私人教师"
  • 知识资产（可增值）
  • 学习历史可验证（简历证明）
```

---

## 6.6 本章总结

```
┌───────────────────────────────────────────────────────────┐
│                INFT 核心设计                              │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  【是什么】                                               │
│  • 基于 ERC-7857 的智能 NFT                              │
│  • 多模态 + 生成性 + 交互性 + 动态性                     │
│                                                           │
│  【为什么】                                               │
│  • 传统 NFT 太"静态"，缺乏持续价值                       │
│  • AI 时代需要"活"的数字资产                             │
│  • 与 0G 生态深度集成（Storage/Compute）                 │
│                                                           │
│  【怎么做】                                               │
│  • 智能合约：状态管理 + 事件触发                         │
│  • AI 模型：0G Storage 存储 + 0G Compute 推理            │
│  • 动态行为：状态机 + 自动化触发                         │
│  • NFT 交互：跨合约调用 + 基因混合                       │
│                                                           │
│  【应用】                                                 │
│  • AI 艺术、游戏道具、数字身份、教育培训                 │
│  • 核心价值：持续创造 + 个性化 + 可组合                  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

**下一章预告**：深入 **多网络共识与 Shared Staking**，理解 0G 如何通过共享质押实现跨网络安全共享。
