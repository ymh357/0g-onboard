# 10. 实战入门

## 本章导读

经过前9章的深度学习，你已经理解了 0G 的架构设计与技术原理。本章将从"理解"转向"实践"，提供完整的代码示例和部署指南，帮助你快速上手 0G 开发。

**学习目标**：
- 搭建0G开发环境
- 掌握Storage SDK的使用
- 学会部署智能合约到0G Chain
- 理解如何调用Compute Network
- 运行自己的Storage节点

---

## 10.1 开发环境准备

### 10.1.1 工具链安装

```bash
# 1. Node.js (v18+)
# macOS:
brew install node

# Ubuntu:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node --version  # v18.0.0+
npm --version   # 9.0.0+

# 2. 0G CLI工具
npm install -g @0g/cli

# 验证
0g --version

# 3. 开发框架（Hardhat）
npm install -g hardhat

# 4. 其他工具
npm install -g typescript ts-node
```

### 10.1.2 连接到0G Testnet

```javascript
// config.js
module.exports = {
  // 0G Galileo Testnet配置
  network: {
    chainId: 16602,
    rpc: "https://evmrpc-testnet.0g.ai",
    explorer: "https://chainscan-galileo.0g.ai"
  },

  // Storage配置
  storage: {
    rpc: "https://rpc-storage-testnet.0g.ai",
    flowContract: "0x22E03a6A89B950F1c82ec5e74F8eCa321a105296"
  },

  // Compute配置
  compute: {
    broker: "https://broker-testnet.0g.ai"
  }
};
```

### 10.1.3 获取测试代币

```bash
# 访问Faucet
open https://faucet.0g.ai

# 或使用CLI
0g faucet request --address <your-address>

# 检查余额
0g balance <your-address>
```

---

## 10.2 实战1：上传文件到0G Storage

### 10.2.1 使用TypeScript SDK

```typescript
// upload-file.ts
import { ZgFile, Indexer, ZgObject } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import fs from "fs";

async function uploadFile() {
  // 1. 初始化Provider和Signer
  const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
  const privateKey = process.env.PRIVATE_KEY!;
  const signer = new ethers.Wallet(privateKey, provider);

  console.log("Using account:", signer.address);

  // 2. 创建Indexer和ZgObject
  const indexer = new Indexer("https://rpc-storage-testnet.0g.ai");
  const zgObject = new ZgObject(indexer);

  // 3. 读取文件
  const filePath = "./example.jpg";
  const fileData = fs.readFileSync(filePath);
  const fileName = "example.jpg";

  console.log(`Uploading file: ${fileName} (${fileData.length} bytes)`);

  // 4. 创建ZgFile对象
  const zgFile = new ZgFile(fileData, {
    tags: ethers.hexlify(ethers.toUtf8Bytes(fileName)),
    size: fileData.length
  });

  // 5. 上传
  console.log("Uploading to 0G Storage...");
  const [txHash, fileHash] = await zgObject.upload(zgFile, 0, signer);

  console.log("Upload successful!");
  console.log("Transaction Hash:", txHash);
  console.log("File Hash:", fileHash);
  console.log("File URL:", `0g://${fileHash}`);

  // 6. 等待确认
  const receipt = await provider.getTransactionReceipt(txHash);
  console.log("Confirmed in block:", receipt?.blockNumber);

  return fileHash;
}

// 运行
uploadFile()
  .then((hash) => {
    console.log("\n✓ File uploaded successfully!");
    console.log("File Hash:", hash);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
```

### 10.2.2 下载文件

```typescript
// download-file.ts
import { Indexer, ZgObject } from "@0glabs/0g-ts-sdk";
import fs from "fs";

async function downloadFile(fileHash: string) {
  // 1. 创建Indexer
  const indexer = new Indexer("https://rpc-storage-testnet.0g.ai");
  const zgObject = new ZgObject(indexer);

  console.log(`Downloading file: ${fileHash}`);

  // 2. 下载文件
  const fileData = await zgObject.download(fileHash);

  // 3. 保存到本地
  const outputPath = `./downloaded_${fileHash.slice(0, 8)}.jpg`;
  fs.writeFileSync(outputPath, Buffer.from(fileData));

  console.log("Downloaded to:", outputPath);
  console.log("File size:", fileData.length, "bytes");
}

// 使用示例
const fileHash = "0x123abc...";  // 从upload返回
downloadFile(fileHash);
```

---

## 10.3 实战2：部署智能合约到0G Chain

### 10.3.1 编写合约

```solidity
// SimpleNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    // 映射：tokenId → 0G Storage中的元数据URI
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("0G NFT", "0GNFT") Ownable(msg.sender) {}

    function mint(address to, string memory metadataURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = metadataURI;
    }

    function tokenURI(uint256 tokenId)
        public view override returns (string memory)
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }
}
```

### 10.3.2 部署脚本

```typescript
// deploy.ts
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SimpleNFT to 0G Chain...");

  // 1. 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 2. 部署合约
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const nft = await SimpleNFT.deploy();
  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log("SimpleNFT deployed to:", address);

  // 3. 验证部署
  const name = await nft.name();
  const symbol = await nft.symbol();
  console.log(`Contract: ${name} (${symbol})`);

  return address;
}

main()
  .then((address) => {
    console.log("\n✓ Deployment successful!");
    console.log("Contract Address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 10.3.3 Hardhat配置

```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    "0g-testnet": {
      url: "https://evmrpc-testnet.0g.ai",
      chainId: 16602,
      accounts: [process.env.PRIVATE_KEY!]
    }
  },
  etherscan: {
    apiKey: {
      "0g-testnet": "no-api-key-needed"
    },
    customChains: [
      {
        network: "0g-testnet",
        chainId: 16602,
        urls: {
          apiURL: "https://chainscan-galileo.0g.ai/api",
          browserURL: "https://chainscan-galileo.0g.ai"
        }
      }
    ]
  }
};

export default config;
```

### 10.3.4 部署与交互

```bash
# 编译合约
npx hardhat compile

# 部署到0G Testnet
npx hardhat run scripts/deploy.ts --network 0g-testnet

# 输出示例：
# Deploying SimpleNFT to 0G Chain...
# Deploying with account: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
# SimpleNFT deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## 10.4 实战3：调用0G Compute进行AI推理

### 10.4.1 调用推理API

```typescript
// inference.ts
import axios from "axios";
import { ethers } from "ethers";

async function runInference() {
  // 1. 配置
  const brokerUrl = "https://broker-testnet.0g.ai";
  const privateKey = process.env.PRIVATE_KEY!;
  const wallet = new ethers.Wallet(privateKey);

  // 2. 构造推理请求
  const request = {
    model: "gpt-3.5-turbo",
    input: {
      messages: [
        { role: "user", content: "Explain 0G Storage in one sentence" }
      ],
      max_tokens: 100
    },
    user_address: wallet.address
  };

  // 3. 签名请求（防止篡改）
  const message = JSON.stringify(request);
  const signature = await wallet.signMessage(message);

  // 4. 发送请求
  console.log("Sending inference request...");
  const response = await axios.post(`${brokerUrl}/v1/inference`, {
    ...request,
    signature
  });

  // 5. 获取结果
  const result = response.data;
  console.log("Inference result:", result.output);
  console.log("Cost:", result.cost, "0G");
  console.log("Provider:", result.provider);

  // 6. 验证TEE证明（可选）
  if (result.attestation) {
    console.log("TEE Attestation:", result.attestation);
    // 实际应用中应验证attestation
  }

  return result;
}

runInference()
  .then((result) => {
    console.log("\n✓ Inference completed!");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 10.4.2 提交微调任务

```typescript
// fine-tuning.ts
async function submitFineTuningJob() {
  const brokerUrl = "https://broker-testnet.0g.ai";
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);

  // 1. 上传训练数据到0G Storage（假设已完成）
  const trainingDataHash = "0g://dataset123";

  // 2. 构造微调任务
  const job = {
    base_model: "llama-3-8b",
    training_data: trainingDataHash,
    hyperparameters: {
      learning_rate: 1e-5,
      epochs: 3,
      batch_size: 32
    },
    budget: "1000 0G",
    user_address: wallet.address
  };

  // 3. 签名并提交
  const signature = await wallet.signMessage(JSON.stringify(job));
  const response = await axios.post(`${brokerUrl}/v1/fine-tune`, {
    ...job,
    signature
  });

  const jobId = response.data.job_id;
  console.log("Fine-tuning job submitted:", jobId);

  // 4. 轮询状态
  let status = "pending";
  while (status !== "completed") {
    await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒

    const statusRes = await axios.get(`${brokerUrl}/v1/fine-tune/${jobId}`);
    status = statusRes.data.status;

    console.log(`Status: ${status} (${statusRes.data.progress}%)`);
  }

  console.log("Model trained! Model ID:", response.data.model_id);
  return response.data.model_id;
}
```

---

## 10.5 实战4：创建简单INFT

### 10.5.1 INFT合约

```solidity
// SimpleINFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleINFT is ERC721 {
    struct InftState {
        uint256 level;
        uint256 experience;
        string mood;
        uint256 lastInteraction;
    }

    mapping(uint256 => InftState) public states;
    mapping(uint256 => string) public aiModels;  // tokenId → 0G Storage URI

    uint256 private _tokenIdCounter;

    event Interacted(uint256 indexed tokenId, string action);
    event LevelUp(uint256 indexed tokenId, uint256 newLevel);

    constructor() ERC721("Simple INFT", "SINFT") {}

    function mint(address to, string memory aiModelURI) public {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);

        // 初始化状态
        states[tokenId] = InftState({
            level: 1,
            experience: 0,
            mood: "neutral",
            lastInteraction: block.timestamp
        });

        aiModels[tokenId] = aiModelURI;
    }

    function interact(uint256 tokenId, string memory action) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");

        InftState storage state = states[tokenId];

        // 增加经验值
        state.experience += 10;
        state.lastInteraction = block.timestamp;

        // 升级检查
        if (state.experience >= state.level * 100) {
            state.level++;
            emit LevelUp(tokenId, state.level);
        }

        // 简化的心情变化
        if (keccak256(bytes(action)) == keccak256(bytes("feed"))) {
            state.mood = "happy";
        } else if (keccak256(bytes(action)) == keccak256(bytes("ignore"))) {
            state.mood = "sad";
        }

        emit Interacted(tokenId, action);
    }

    function getState(uint256 tokenId)
        public view returns (InftState memory)
    {
        return states[tokenId];
    }

    // AI生成内容（链下执行，链上记录）
    function generate(uint256 tokenId, string memory prompt)
        public returns (bytes32 requestId)
    {
        require(ownerOf(tokenId) == msg.sender, "Not owner");

        // 生成请求ID
        requestId = keccak256(abi.encodePacked(tokenId, prompt, block.timestamp));

        // 触发事件，链下AI监听
        emit GenerateRequest(tokenId, prompt, requestId);

        return requestId;
    }

    event GenerateRequest(
        uint256 indexed tokenId,
        string prompt,
        bytes32 requestId
    );
}
```

---

## 10.6 实战5：运行Storage节点

### 10.6.1 硬件要求

```
最小配置：
- CPU: 4核
- 内存: 16 GB
- 存储: 2 TB SSD
- 网络: 100 Mbps

推荐配置：
- CPU: 8核+
- 内存: 32 GB+
- 存储: 8 TB NVMe SSD
- 网络: 1 Gbps
```

### 10.6.2 安装节点

```bash
# 1. 下载0G Storage Node
wget https://github.com/0gfoundation/0g-storage-node/releases/latest/download/0g-storage-node-linux-amd64.tar.gz

# 2. 解压
tar -xzf 0g-storage-node-linux-amd64.tar.gz
cd 0g-storage-node

# 3. 配置
cp config.example.toml config.toml
nano config.toml

# 配置示例：
# [network]
# rpc_url = "https://evmrpc-testnet.0g.ai"
# chain_id = 16602
#
# [storage]
# data_dir = "/data/0g-storage"
# max_size_gb = 8000  # 8TB
#
# [miner]
# miner_address = "0xYourAddress"
# private_key_file = "/path/to/keyfile"

# 4. 启动节点
./0g-storage-node --config config.toml

# 5. 检查状态
./0g-storage-cli status
```

### 10.6.3 PoRA挖矿

```bash
# 启用挖矿
./0g-storage-cli miner start

# 查看挖矿状态
./0g-storage-cli miner status

# 输出示例：
# Miner Status:
# - Status: Running
# - Storage: 2.5 TB / 8 TB
# - PoRA Submissions: 1,234
# - Rewards Earned: 567.89 0G
# - Scratchpad Hit Rate: 1.2%
```

---

## 10.7 综合项目：去中心化图床

### 10.7.1 项目架构

```
去中心化图床（0G Image Host）：

前端（React）
  ↓
  上传图片
  ↓
0G Storage（存储图片）
  ↓
  获取图片哈希
  ↓
智能合约（记录元数据）
  ↓
  链上索引
  ↓
用户可通过哈希访问图片
```

### 10.7.2 核心代码

```typescript
// ImageHost.tsx
import React, { useState } from "react";
import { ZgFile, ZgObject } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

function ImageHost() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageHash, setImageHash] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // 1. 连接钱包
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 2. 读取文件
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      // 3. 上传到0G Storage
      const indexer = new Indexer("https://rpc-storage-testnet.0g.ai");
      const zgObject = new ZgObject(indexer);
      const zgFile = new ZgFile(fileData, { size: fileData.length });

      const [txHash, hash] = await zgObject.upload(zgFile, 0, signer);

      setImageHash(hash);
      console.log("Uploaded! Hash:", hash);

      // 4. 记录到智能合约（可选）
      // const contract = new ethers.Contract(contractAddress, abi, signer);
      // await contract.addImage(hash, file.name);

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>0G Image Host</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload to 0G"}
      </button>

      {imageHash && (
        <div>
          <p>Upload successful!</p>
          <p>Image Hash: {imageHash}</p>
          <img src={`https://gateway.0g.ai/${imageHash}`} alt="Uploaded" />
          <p>Share URL: https://gateway.0g.ai/{imageHash}</p>
        </div>
      )}
    </div>
  );
}

export default ImageHost;
```

---

## 10.8 学习资源

```
┌──────────────────────────────────────────────────────────┐
│                  0G开发资源导航                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  官方文档：                                              │
│  • https://docs.0g.ai/                                   │
│                                                          │
│  GitHub仓库：                                            │
│  • https://github.com/0gfoundation                       │
│  • 0g-storage-node                                       │
│  • 0g-storage-client                                     │
│  • 0g-ts-sdk                                             │
│                                                          │
│  开发者社区：                                            │
│  • Discord: https://discord.gg/0glabs                    │
│  • Telegram: https://t.me/zgcommunity                    │
│                                                          │
│  示例项目：                                              │
│  • ZgDrive (Golang)                                      │
│  • Sentinel0 (TypeScript)                                │
│  • Care-AI (TypeScript)                                  │
│                                                          │
│  测试网络：                                              │
│  • Faucet: https://faucet.0g.ai                          │
│  • Explorer: https://chainscan-galileo.0g.ai             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 10.9 本章总结

```
┌───────────────────────────────────────────────────────────┐
│              实战入门核心要点                             │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  【开发流程】                                             │
│  1. 环境准备：工具安装、网络配置、获取测试币             │
│  2. Storage实战：上传/下载文件，理解SDK API              │
│  3. 合约开发：部署到0G Chain，EVM完全兼容                │
│  4. Compute集成：调用AI推理，提交微调任务                │
│  5. INFT开发：创建智能NFT，动态状态管理                  │
│  6. 节点运营：部署Storage节点，PoRA挖矿                  │
│                                                           │
│  【关键技巧】                                             │
│  • 使用TypeScript SDK简化开发                            │
│  • 复用Ethereum工具链（Hardhat, ethers.js）              │
│  • 从小项目开始，逐步增加复杂度                           │
│  • 参考社区示例项目                                       │
│                                                           │
│  【下一步】                                               │
│  • 加入Discord社区，获取实时帮助                          │
│  • 参与Hackathon，构建创新应用                            │
│  • 贡献开源项目，深入理解内部实现                         │
│  • 关注路线图，跟进新特性                                 │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## 全教程总结

**恭喜你完成了《0G 深度解析》教程！**

从 **Chain 共识** 到 **Storage 架构**，从 **PoRA 激励** 到 **DA 扩展**，从 **Compute 网络** 到 **INFT 创新**，你已经系统地掌握了 0G 生态的方方面面。

**你现在能够**：
- ✓ 深入理解 0G 的技术架构与设计哲学
- ✓ 分析各组件的工作原理与协同机制
- ✓ 对比 0G 与其他项目的优劣势
- ✓ 动手开发基于 0G 的去中心化应用
- ✓ 运营自己的 Storage 节点参与生态

**继续你的 0G 之旅**：
- 🚀 构建你的第一个 AI×Crypto 应用
- 💡 参与社区讨论，分享你的见解
- 🛠️ 为 0G 开源项目贡献代码
- 📈 探索 0G 生态的商业机会

**0G 的使命**：成为 AI 时代的去中心化基础设施。

**你的角色**：成为这一变革的参与者与建设者。

**Let's build the future together! 🌟**
