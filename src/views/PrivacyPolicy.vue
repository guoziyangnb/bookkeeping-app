<template>
	<div class="privacy-page">
		<BackNavBar title="隐私政策" />

		<div class="content-container">
			<div class="content">
				<h2>阳阳记账隐私政策</h2>

				<h3>引言</h3>
				<p>
					欢迎使用阳阳记账！我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
				</p>

				<h3>1. 我们如何收集和使用您的个人信息</h3>
				<p>我们会遵循正当、合法、必要的原则，仅为实现产品功能，向您提供服务之目的，收集和使用您的个人信息。</p>

				<h4>1.1 账号信息</h4>
				<p>当您注册和使用本应用时，我们可能收集以下信息：</p>
				<ul>
					<li>用户名、头像等个人资料信息</li>
					<li>手机号码、电子邮箱等联系方式</li>
					<li>身份验证信息（如密码加密后的信息）</li>
				</ul>

				<h4>1.2 记账数据</h4>
				<p>为提供记账服务，我们会收集您的：</p>
				<ul>
					<li>收支记录（包括金额、类别、日期、备注等）</li>
					<li>分类统计信息</li>
					<li>预算设置信息</li>
				</ul>

				<h4>1.3 设备信息</h4>
				<p>我们可能会收集您的设备信息，包括：</p>
				<ul>
					<li>设备型号、操作系统版本</li>
					<li>唯一设备标识符</li>
					<li>网络类型和状态</li>
				</ul>

				<h3>2. 信息的使用</h3>
				<p>我们收集和使用您的个人信息，主要用于以下目的：</p>
				<ul>
					<li>提供记账服务和数据统计功能</li>
					<li>保存您的数据到云端，实现多设备同步</li>
					<li>改进和优化我们的产品和服务</li>
					<li>向您发送重要通知（如服务更新、安全提醒等）</li>
					<li>防范欺诈和滥用行为，保护应用安全</li>
				</ul>

				<h3>3. 信息的共享、转让、公开披露</h3>

				<h4>3.1 共享</h4>
				<p>我们不会与第三方共享您的个人信息，除非：</p>
				<ul>
					<li>获得您的明确同意</li>
					<li>根据法律法规或政府主管部门要求</li>
					<li>为维护我们的合法权益</li>
				</ul>

				<h4>3.2 转让</h4>
				<p>我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：</p>
				<ul>
					<li>获得您的明确同意</li>
					<li>在涉及合并、收购或破产清算时</li>
				</ul>

				<h4>3.3 公开披露</h4>
				<p>我们仅会在以下情况下公开披露您的个人信息：</p>
				<ul>
					<li>获得您的明确同意</li>
					<li>基于法律规定或合理依据的公开披露</li>
				</ul>

				<h3>4. 信息的存储</h3>
				<p>
					您的个人信息将存储在中华人民共和国境内的服务器上。我们会采取合理的安全措施保护您的信息，防止未经授权的访问、使用或泄露。在满足相关法律法规要求的前提下，我们仅在为实现目的所必需的最短时间内保留您的个人信息。
				</p>

				<h3>5. 信息安全</h3>
				<p>我们采取以下安全措施保护您的个人信息：</p>
				<ul>
					<li>数据传输采用HTTPS加密</li>
					<li>敏感数据加密存储</li>
					<li>严格的访问权限控制</li>
					<li>定期进行安全审计和漏洞修复</li>
					<li>建立数据安全应急响应机制</li>
				</ul>
				<p>尽管如此，请您注意，任何安全措施都无法做到绝对安全。</p>

				<h3>6. 您的权利</h3>
				<p>您对自己的个人信息享有以下权利：</p>
				<ul>
					<li>访问、查阅您的个人信息</li>
					<li>更正、补充您的个人信息</li>
					<li>删除您的个人信息</li>
					<li>注销您的账号</li>
					<li>撤回同意授权</li>
				</ul>

				<h3>7. 未成年人保护</h3>
				<p>我们的服务主要面向成年人。如果您是未成年人，请在监护人的陪同下阅读本政策，并取得监护人的同意后，方可使用我们的服务。</p>

				<h3>8. 隐私政策的更新</h3>
				<p>
					我们可能适时修订本隐私政策的条款，该等修订构成本隐私政策的一部分。如该等修订造成您在本隐私政策下权利的实质减少，我们将在修订生效前通过在主页上显著位置提示或向您发送电子邮件等方式通知您。
				</p>

				<h3>9. 如何联系我们</h3>
				<p>如果您对本隐私政策有任何疑问、意见或建议，或您需要行使相关的权利，请通过应用内的反馈功能与我们联系。</p>

				<div class="update-time">
					<p>最后更新日期：2026年1月10日</p>
					<p>生效日期：2026年1月10日</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import BackNavBar from '@/components/common/BackNavBar.vue'
</script>

<style scoped>
.privacy-page {
	min-height: 100vh;
	background: var(--bg-primary);
	position: relative;
}

.content-container {
	max-width: 800px;
	margin: 0 auto;
}

.content {
	background: var(--bg-secondary);
	border-radius: var(--radius-lg);
	padding: 24px;
	line-height: 1.8;
	color: var(--text-primary);
}

h2 {
	font-size: 22px;
	font-weight: 600;
	color: var(--text-primary);
	margin-bottom: 24px;
	text-align: center;
}

h3 {
	font-size: 18px;
	font-weight: 600;
	color: var(--text-primary);
	margin-top: 24px;
	margin-bottom: 12px;
}

h4 {
	font-size: 16px;
	font-weight: 600;
	color: var(--text-primary);
	margin-top: 20px;
	margin-bottom: 10px;
}

p {
	font-size: 15px;
	color: var(--text-secondary);
	margin-bottom: 12px;
	line-height: 1.8;
}

ul {
	margin: 12px 0;
	padding-left: 24px;
}

li {
	font-size: 15px;
	color: var(--text-secondary);
	margin-bottom: 8px;
	line-height: 1.8;
}

.update-time {
	margin-top: 32px;
	padding-top: 20px;
	border-top: 1px solid var(--bg-glass-border);
}

.update-time p {
	font-size: 14px;
	color: var(--text-secondary);
	text-align: center;
	margin-bottom: 4px;
}
</style>
