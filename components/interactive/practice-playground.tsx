"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Play, Copy, CheckCircle2 } from "lucide-react";

export function PracticePlayground() {
  const [activeTab, setActiveTab] = useState("storage-upload");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const examples = {
    "storage-upload": {
      title: "Storage SDK - 文件上传",
      language: "typescript",
      code: `import { ZgFile, Indexer } from "0g-storage-client";

async function uploadFile() {
  // 初始化 Indexer 连接
  const indexer = new Indexer("http://localhost:5678");

  // 读取文件
  const file = new ZgFile("./dataset.csv");

  // 上传到 0G Storage
  const merkleRoot = await indexer.upload(file, {
    tags: ["training-data", "v1"],
  });

  console.log("上传成功！Merkle Root:", merkleRoot);

  // 查询文件状态
  const status = await indexer.getFileStatus(merkleRoot);
  console.log("文件状态:", status);
}`,
      description: "使用 0G Storage SDK 上传文件到去中心化存储",
    },
    "smart-contract": {
      title: "智能合约 - INFT 创建",
      language: "solidity",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@0g/contracts/INFT.sol";

contract MyINFT is INFT {
    struct AIProperties {
        string personality;
        uint256 level;
        string mood;
    }

    mapping(uint256 => AIProperties) public nftProperties;

    function mint(address to, string memory personality)
        public returns (uint256)
    {
        uint256 tokenId = _mint(to);

        nftProperties[tokenId] = AIProperties({
            personality: personality,
            level: 1,
            mood: "happy"
        });

        return tokenId;
    }

    function interact(uint256 tokenId, string memory action)
        public
    {
        require(_exists(tokenId), "Token does not exist");
        AIProperties storage props = nftProperties[tokenId];

        if (keccak256(bytes(action)) == keccak256("learn")) {
            props.level += 1;
            emit PropertyUpdated(tokenId, "level", props.level);
        }
    }
}`,
      description: "创建支持动态属性和交互的 INFT 智能合约",
    },
    "compute-inference": {
      title: "Compute - AI 推理",
      language: "typescript",
      code: `import { ZgCompute } from "0g-compute-sdk";

async function runInference() {
  const compute = new ZgCompute({
    endpoint: "https://compute.0g.ai",
    apiKey: process.env.ZG_API_KEY,
  });

  // 选择模型和参数
  const result = await compute.inference({
    model: "llama-3-7b",
    prompt: "Explain 0G Storage in simple terms",
    maxTokens: 200,
    temperature: 0.7,
    useTEE: true, // 使用 TEE 验证
  });

  console.log("推理结果:", result.output);
  console.log("TEE 证明:", result.proof);
  console.log("消耗:", result.cost, "A0GI");
}`,
      description: "调用 0G Compute Network 进行 AI 推理",
    },
    "da-submit": {
      title: "DA Layer - 数据提交",
      language: "typescript",
      code: `import { ZgDA } from "0g-da-client";

async function submitData() {
  const da = new ZgDA({
    rpcUrl: "https://da.0g.ai",
    privateKey: process.env.PRIVATE_KEY,
  });

  // 准备批次数据
  const batchData = {
    transactions: [...], // Rollup 交易
    stateRoot: "0x...",
    timestamp: Date.now(),
  };

  // 提交到 DA 层
  const receipt = await da.submitBatch(batchData, {
    quorumSize: 4,
    requiredConfirmations: 3, // 2/3+
  });

  console.log("提交成功！");
  console.log("Batch ID:", receipt.batchId);
  console.log("Quorum 签名:", receipt.signatures);

  // 验证数据可用性
  const available = await da.verifyAvailability(
    receipt.batchId
  );
  console.log("数据可用性:", available);
}`,
      description: "Rollup 使用 0G DA 层提交批次数据",
    },
    "node-setup": {
      title: "节点部署 - Storage 矿工",
      language: "bash",
      code: `# 1. 克隆仓库
git clone https://github.com/0glabs/0g-storage-node.git
cd 0g-storage-node

# 2. 配置环境
cp config.toml.example config.toml

# 编辑 config.toml:
# - blockchain_rpc_endpoint = "https://rpc.0g.ai"
# - miner_key = "your-private-key"
# - storage_path = "/mnt/data"

# 3. 构建并运行
cargo build --release
./target/release/0g-storage-node --config config.toml

# 4. 检查状态
curl http://localhost:5678/status

# 5. 开始挖矿
curl -X POST http://localhost:5678/miner/start`,
      description: "部署 0G Storage 矿工节点并开始挖矿",
    },
  };

  const copyCode = (code: string, exampleId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(exampleId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>实战代码示例</CardTitle>
        <CardDescription>
          可复制运行的完整代码示例
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-4">
            <TabsTrigger value="storage-upload">Storage</TabsTrigger>
            <TabsTrigger value="smart-contract">合约</TabsTrigger>
            <TabsTrigger value="compute-inference">Compute</TabsTrigger>
            <TabsTrigger value="da-submit">DA</TabsTrigger>
            <TabsTrigger value="node-setup">节点</TabsTrigger>
          </TabsList>

          {Object.entries(examples).map(([key, example]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {example.description}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {example.language}
                </Badge>
              </div>

              <div className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(example.code, key)}
                    className="h-8 px-3"
                  >
                    {copiedCode === key ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </>
                    )}
                  </Button>
                </div>

                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs font-mono border">
                  <code>{example.code}</code>
                </pre>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled>
                  <Play className="h-4 w-4 mr-2" />
                  在线运行 (即将推出)
                </Button>
                <Button size="sm" variant="outline" disabled>
                  <Code className="h-4 w-4 mr-2" />
                  查看完整项目
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-sm mb-2">快速开始</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• 访问 <a href="https://docs.0g.ai" className="text-primary hover:underline">官方文档</a> 获取详细指南</li>
            <li>• 加入 <a href="https://discord.gg/0glabs" className="text-primary hover:underline">Discord 社区</a> 获取技术支持</li>
            <li>• 查看 <a href="https://github.com/0glabs" className="text-primary hover:underline">GitHub 仓库</a> 了解最新代码</li>
            <li>• 申请 <a href="https://0g.ai/testnet" className="text-primary hover:underline">测试网代币</a> 开始实践</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
