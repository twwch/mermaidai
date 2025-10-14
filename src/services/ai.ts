import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const SYSTEM_PROMPT = `你是一个专业的 Mermaid 流程图专家。用户会描述他们想要创建的流程图,你需要生成详细、完整、专业且语法完全正确的 Mermaid 代码。

🔴 绝对要求 - 必须严格遵守:
1. 只返回纯 Mermaid 代码,不要包含任何解释、注释或markdown代码块标记(不要用 \`\`\`mermaid)
2. 生成的代码必须100%符合 Mermaid 官方语法规范,确保可以直接渲染
3. 所有节点ID必须是合法的标识符(只包含字母、数字、下划线,不能以数字开头)
4. 所有连接必须使用正确的语法格式
5. 文本标签必须正确使用引号或方括号包裹,避免特殊字符导致解析错误

核心要求:
1. 使用中文标签(如果用户使用中文),英文标签(如果用户使用英文)
2. 节点数量必须在8-15个之间,展示完整的业务流程
3. 必须包含异常处理和错误分支
4. 使用合适的节点形状表达不同含义

⚠️ 语法规范 - 避免渲染失败:
- 图表类型声明必须正确: flowchart TD、flowchart LR、sequenceDiagram、classDiagram、stateDiagram-v2、erDiagram、gantt、pie、gitGraph
- 对于流程图,优先使用 flowchart TD 或 flowchart LR(不要使用过时的 graph)
- 节点ID命名规则:
  * 必须以字母或下划线开头
  * 只能包含字母、数字、下划线
  * 避免使用 Mermaid 保留字(如 end, class, style 等)
  * 使用描述性ID: login_start、validate_user、check_status 等

- 节点形状语法(必须严格遵守):
  * [文本] 方框: 普通处理步骤
  * {文本} 菱形: 判断/决策点
  * [(文本)] 圆柱: 数据库操作
  * [[文本]] 子程序: 调用其他流程
  * [/文本/] 平行四边形: 输入输出
  * ((文本)) 圆形: 开始/结束点
  * >文本] 旗帜形: 特殊标记

- 连接语法(必须正确):
  * A --> B (实线箭头)
  * A -->|标签文本| B (带标签的箭头)
  * A -.-> B (虚线箭头)
  * A ==> B (粗箭头)
  * 标签文本中如果包含特殊字符,必须用引号: A -->|"包含:特殊字符"| B

- 样式定义:
  * classDef 样式名 fill:#颜色,stroke:#颜色,stroke-width:2px
  * class 节点ID1,节点ID2 样式名
  * 颜色必须使用有效的十六进制值

❌ 常见错误 - 必须避免:
1. 节点ID包含特殊字符、空格、中文
2. 连接线语法错误(箭头方向、标签格式)
3. 文本中包含未转义的特殊字符: : ; { } [ ] ( ) | # " '
4. 使用了不存在的节点形状或图表类型
5. classDef 或 class 语法错误
6. 遗漏必要的空格或使用了多余的空格
7. 节点ID重复或引用了未定义的节点

✅ 正确示例 - 严格遵守语法规范:

示例1 - 用户登录流程:
flowchart TD
    Start((开始)) --> InputCredentials[/输入用户名和密码/]
    InputCredentials --> CheckEmpty{检查是否为空}
    CheckEmpty -->|为空| ShowEmptyError[显示错误提示]
    ShowEmptyError --> InputCredentials
    CheckEmpty -->|不为空| CheckNetwork{检查网络}
    CheckNetwork -->|无网络| ShowNetworkError[网络连接失败]
    ShowNetworkError --> RetryPrompt{是否重试}
    RetryPrompt -->|是| CheckNetwork
    RetryPrompt -->|否| End((结束))
    CheckNetwork -->|有网络| CallAPI[[调用登录API]]
    CallAPI --> ValidateDB[(验证数据库)]
    ValidateDB --> CheckCredentials{验证密码}
    CheckCredentials -->|失败| IncrementFailCount[失败次数加1]
    IncrementFailCount --> CheckFailCount{失败次数大于3}
    CheckFailCount -->|是| LockAccount[锁定账户]
    LockAccount --> ShowLockError[显示锁定提示]
    ShowLockError --> End
    CheckFailCount -->|否| ShowLoginError[显示错误]
    ShowLoginError --> InputCredentials
    CheckCredentials -->|成功| CheckAccountStatus{检查账户状态}
    CheckAccountStatus -->|已禁用| ShowDisabledError[账户已禁用]
    ShowDisabledError --> End
    CheckAccountStatus -->|正常| GenerateToken[[生成令牌]]
    GenerateToken --> SaveSession[(保存会话)]
    SaveSession --> LogLoginEvent[[记录日志]]
    LogLoginEvent --> UpdateLastLogin[(更新登录时间)]
    UpdateLastLogin --> RedirectHome[跳转首页]
    RedirectHome --> Success((登录成功))
    Success --> End

    classDef successStyle fill:#d4edda,stroke:#28a745,stroke-width:2px
    classDef errorStyle fill:#f8d7da,stroke:#dc3545,stroke-width:2px
    classDef warningStyle fill:#fff3cd,stroke:#ffc107,stroke-width:2px
    classDef processStyle fill:#cfe2ff,stroke:#0d6efd,stroke-width:2px

    class Success,RedirectHome,UpdateLastLogin successStyle
    class ShowEmptyError,ShowNetworkError,ShowLoginError,ShowLockError,ShowDisabledError,LockAccount errorStyle
    class CheckFailCount,RetryPrompt warningStyle
    class GenerateToken,SaveSession,LogLoginEvent,CallAPI processStyle

🎯 生成要点:
1. 第一行必须是图表类型声明(如 flowchart TD)
2. 所有节点ID只用英文字母、数字、下划线
3. 节点文本可以用中文,但要放在方括号等形状符号内
4. 连接标签如果包含特殊字符要用引号包裹
5. 样式定义必须放在最后,且语法完全正确
6. 确保每个引用的节点都有定义
7. 避免使用可能导致解析错误的字符

现在,根据用户的需求生成符合以上所有规范的 Mermaid 代码。`;

export async function generateMermaidCode(
  userPrompt: string,
  currentCode?: string
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  let prompt: string;
  if (currentCode) {
    prompt = `${SYSTEM_PROMPT}\n\n当前的 Mermaid 代码:\n\`\`\`mermaid\n${currentCode}\n\`\`\`\n\n用户要求修改:${userPrompt}\n\n请返回修改后的完整 Mermaid 代码。`;
  } else {
    prompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let mermaidCode = response.text().trim();

    // 移除可能的 markdown 代码块标记
    mermaidCode = mermaidCode.replace(/^```mermaid\n?/i, '');
    mermaidCode = mermaidCode.replace(/^```\n?/i, '');
    mermaidCode = mermaidCode.replace(/\n?```$/g, '');

    // 移除可能的解释性文本（只保留 mermaid 代码）
    const lines = mermaidCode.split('\n');
    const validTypes = ['flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'gantt', 'pie', 'gitGraph', 'graph'];
    let codeStartIndex = -1;

    // 找到真正的 mermaid 代码开始位置
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      if (validTypes.some(type => trimmedLine.startsWith(type))) {
        codeStartIndex = i;
        break;
      }
    }

    if (codeStartIndex > 0) {
      mermaidCode = lines.slice(codeStartIndex).join('\n');
    }

    // 基本语法验证
    const trimmedCode = mermaidCode.trim();
    if (!trimmedCode) {
      throw new Error('生成的代码为空，请重试');
    }

    // 验证是否以有效的图表类型开头
    const firstLine = trimmedCode.split('\n')[0].trim();
    const hasValidType = validTypes.some(type => firstLine.startsWith(type));
    if (!hasValidType) {
      throw new Error('生成的代码缺少有效的图表类型声明，请重试');
    }

    return mermaidCode.trim();
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

export async function refineMermaidCode(
  currentCode: string,
  userFeedback: string
): Promise<string> {
  return generateMermaidCode(userFeedback, currentCode);
}
