"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, AlertTriangle } from "lucide-react";

export function SharedStakingDiagram() {
  const [chainStake, setChainStake] = useState(40);
  const [storageStake, setStorageStake] = useState(30);
  const [daStake, setDAStake] = useState(30);

  const totalStake = chainStake + storageStake + daStake;
  const chainAPR = (chainStake / totalStake) * 15 + 5;
  const storageAPR = (storageStake / totalStake) * 12 + 4;
  const daAPR = (daStake / totalStake) * 10 + 3;

  const networks = [
    {
      name: "0G Chain",
      stake: chainStake,
      apr: chainAPR,
      color: "bg-blue-500",
      risk: "低",
    },
    {
      name: "0G Storage",
      stake: storageStake,
      apr: storageAPR,
      color: "bg-green-500",
      risk: "中",
    },
    {
      name: "0G DA",
      stake: daStake,
      apr: daAPR,
      color: "bg-purple-500",
      risk: "中",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Shared Staking 收益模拟</CardTitle>
        <CardDescription>
          调整质押分配，查看跨网络安全共享和收益
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stake allocation controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>0G Chain 质押比例</Label>
              <span className="text-sm text-muted-foreground">{chainStake}%</span>
            </div>
            <Slider
              value={[chainStake]}
              onValueChange={(v) => setChainStake(v[0])}
              min={0}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>0G Storage 质押比例</Label>
              <span className="text-sm text-muted-foreground">{storageStake}%</span>
            </div>
            <Slider
              value={[storageStake]}
              onValueChange={(v) => setStorageStake(v[0])}
              min={0}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>0G DA 质押比例</Label>
              <span className="text-sm text-muted-foreground">{daStake}%</span>
            </div>
            <Slider
              value={[daStake]}
              onValueChange={(v) => setDAStake(v[0])}
              min={0}
              max={100}
              step={5}
            />
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm">
            <span className="text-muted-foreground">总质押比例: </span>
            <span className={`font-bold ${totalStake === 100 ? "text-green-500" : "text-yellow-500"}`}>
              {totalStake}%
            </span>
            {totalStake !== 100 && (
              <span className="text-xs text-muted-foreground ml-2">
                (建议调整至 100%)
              </span>
            )}
          </div>
        </div>

        {/* Network overview */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">网络收益概览</h4>
          {networks.map((network, i) => (
            <div
              key={i}
              className="p-4 bg-muted/30 rounded-lg border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${network.color}`} />
                  <span className="font-semibold">{network.name}</span>
                </div>
                <Badge variant="outline">{network.risk}风险</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">质押比例:</span>
                  <span className="ml-2 font-medium">{network.stake}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">预计 APR:</span>
                  <span className="ml-2 font-medium text-green-500">
                    {network.apr.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Stake bar visualization */}
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${network.color} transition-all duration-300`}
                  style={{ width: `${network.stake}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total rewards */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold">总预期收益</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {((chainAPR * chainStake + storageAPR * storageStake + daAPR * daStake) / totalStake).toFixed(2)}% APR
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            基于当前质押分配的加权平均收益率
          </p>
        </div>

        {/* Key features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Shared Staking 优势</h4>
          <div className="grid gap-2">
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded">
              <Shield className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-semibold text-sm">安全性共享</div>
                <div className="text-xs text-muted-foreground">
                  Chain 的高安全性可以共享给 Storage 和 DA 网络
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded">
              <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-semibold text-sm">收益多元化</div>
                <div className="text-xs text-muted-foreground">
                  验证者可以同时从多个网络获得奖励
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">跨网络惩罚</div>
                <div className="text-xs text-muted-foreground">
                  在任一网络的恶意行为会影响所有网络的质押
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
