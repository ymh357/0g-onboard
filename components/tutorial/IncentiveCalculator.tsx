"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp } from "lucide-react";

export function IncentiveCalculator() {
  const [dataSize, setDataSize] = useState<string>("1024");
  const [endowment, setEndowment] = useState<string>("1000");
  const [storageYears, setStorageYears] = useState<string>("1");

  // 计算单位价格（ZG per sector）
  const dataSizeSectors = parseFloat(dataSize) || 0;
  const endowmentAmount = parseFloat(endowment) || 0;
  const unitPrice = dataSizeSectors > 0 ? endowmentAmount / dataSizeSectors : 0;

  // 计算年化奖励释放（4% per year）
  const annualReleaseRate = 0.04;
  const annualReward = endowmentAmount * annualReleaseRate;
  const totalReward = annualReward * parseFloat(storageYears || "1");

  // 计算每 8 GB 定价段的奖励
  const sectorsPer8GB = (8 * 1024 * 1024 * 1024) / 256; // 8GB in sectors
  const segments = Math.floor(dataSizeSectors / sectorsPer8GB);
  const rewardPerSegment = totalReward / Math.max(segments, 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <CardTitle>存储成本与挖矿奖励计算器</CardTitle>
        </div>
        <CardDescription>
          计算存储成本和预期挖矿奖励，帮助理解 0G Storage 的经济模型
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 输入参数 */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataSize">数据大小（sectors，256B each）</Label>
            <Input
              id="dataSize"
              type="number"
              value={dataSize}
              onChange={(e) => setDataSize(e.target.value)}
              placeholder="1024"
            />
            <div className="text-xs text-muted-foreground">
              {dataSizeSectors > 0
                ? `≈ ${(dataSizeSectors * 256 / 1024).toFixed(2)} KB`
                : "1 sector = 256 bytes"}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endowment">存储捐赠（ZG 代币）</Label>
            <Input
              id="endowment"
              type="number"
              value={endowment}
              onChange={(e) => setEndowment(e.target.value)}
              placeholder="1000"
            />
            <div className="text-xs text-muted-foreground">
              一次付费，永久存储
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">存储年限</Label>
            <Input
              id="years"
              type="number"
              value={storageYears}
              onChange={(e) => setStorageYears(e.target.value)}
              placeholder="1"
            />
            <div className="text-xs text-muted-foreground">
              用于计算总奖励
            </div>
          </div>
        </div>

        {/* 计算结果 */}
        {dataSizeSectors > 0 && endowmentAmount > 0 && (
          <div className="space-y-4 p-4 rounded-lg bg-muted">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold mb-2">单位价格</div>
                <div className="text-2xl font-bold">
                  {unitPrice.toFixed(4)} ZG/sector
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  必须超过全局下限才能被接受
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">年化奖励释放</div>
                <div className="text-2xl font-bold">
                  {annualReward.toFixed(2)} ZG/年
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  释放速率：4% / 年
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" />
                <div className="text-sm font-semibold">
                  {storageYears} 年总奖励（估算）
                </div>
              </div>
              <div className="text-xl font-bold">
                {totalReward.toFixed(2)} ZG
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                注意：实际奖励还包含基础奖励（R_base），且存储奖励（R_storage）取决于挖矿频率和定价段
              </div>
            </div>

            {segments > 0 && (
              <div className="pt-4 border-t">
                <div className="text-sm font-semibold mb-2">定价段信息</div>
                <div className="text-sm text-muted-foreground">
                  <p>• 数据跨越 {segments} 个定价段（每 8 GB 一个段）</p>
                  <p>• 每个段的奖励池会持续释放奖励</p>
                  <p>• 矿工挖到该段数据时，可获得该段奖励池余额的一半</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 说明 */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-500">
          <div className="text-sm font-semibold mb-2">重要说明：</div>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• 实际挖矿奖励 = 基础奖励（R_base）+ 存储奖励（R_storage）</li>
            <li>• 基础奖励随时间递减，鼓励早期参与</li>
            <li>• 存储奖励取决于数据被挖到的频率和定价段的奖励池余额</li>
            <li>• 热门数据：奖励在多个矿工间分摊</li>
            <li>• 冷门数据：奖励累积，存储冷门数据的矿工获得更高回报</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
