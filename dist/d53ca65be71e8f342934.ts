"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("../utils/storage");
document.addEventListener('DOMContentLoaded', () => {
    const matchBtn = document.getElementById('matchBtn');
    const fieldInput = document.getElementById('fieldInput');
    const seasonInput = document.getElementById('seasonInput'); // e.g. "2023-Q1"
    const resultDiv = document.getElementById('result');
    if (matchBtn) {
        matchBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            const field = fieldInput.value.trim();
            const season = seasonInput.value.trim();
            if (!field || !season) {
                resultDiv.textContent = "请输入字段名和赛季 (如 2023-Q1)";
                return;
            }
            resultDiv.textContent = "正在搜索...";
            const alphas = yield (0, storage_1.getSeasonFactors)(season);
            if (!alphas || alphas.length === 0) {
                resultDiv.textContent = `未找到 ${season} 的本地数据，请先去下载。`;
                return;
            }
            // 强匹配逻辑：检查表达式中是否包含该字段
            // 注意：这里只是简单的字符串包含，如果需要精确的词法分析(如你Python脚本里的)，需要移植那个逻辑
            const matched = alphas.filter(alpha => {
                // 简单匹配：完全相等 或者 包含 (根据你的需求调整)
                // 你的需求是：手动输入一个字段去跟本地这个赛季的因子表达式去匹配
                // 假设字段是 "close"，表达式是 "ts_rank(close, 10)"
                // 这里做一个简单的正则边界匹配
                const regex = new RegExp(`\\b${field}\\b`);
                return regex.test(alpha.code);
            });
            if (matched.length > 0) {
                resultDiv.innerHTML = `
                    <h3>匹配成功 (${matched.length} 个):</h3>
                    <ul>
                        ${matched.map(a => `
                            <li>
                                <strong>ID:</strong> ${a.id}<br/>
                                <strong>Date:</strong> ${a.dateCreated}<br/>
                                <code>${a.code}</code>
                            </li>
                        `).join('')}
                    </ul>
                `;
            }
            else {
                resultDiv.textContent = "未匹配到任何因子。";
            }
        }));
    }
});
