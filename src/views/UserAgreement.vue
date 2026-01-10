<template>
	<div class="agreement-page">
		<BackNavBar title="用户协议" />

		<div class="content-container">
			<div class="content">
				<h2>阳阳记账用户协议</h2>

				<h3>1. 协议的接受</h3>
				<p>欢迎使用阳阳记账！当您使用本应用时，即表示您已阅读、理解并同意接受本用户协议的全部内容。如果您不同意本协议的任何条款，请立即停止使用本应用。</p>

				<h3>2. 服务内容</h3>
				<p>阳阳记账是一款个人财务管理应用，为用户提供记账、统计分析、数据备份等功能。我们保留随时修改或中断服务而不需通知用户的权利。</p>

				<h3>3. 用户义务</h3>
				<p>用户在使用本应用时，必须遵守以下规定：</p>
				<ul>
					<li>不得利用本应用进行任何违法或不当的活动</li>
					<li>不得干扰或破坏本服务的正常运行</li>
					<li>妥善保管自己的账号和密码，对使用该账号的所有行为负责</li>
					<li>不得上传、传播任何违法、有害、虚假的信息</li>
				</ul>

				<h3>4. 知识产权</h3>
				<p>本应用中的所有内容，包括但不限于文字、图片、软件、程序、版面设计等，均受知识产权法保护。未经授权，任何人不得擅自使用、复制、修改、传播这些内容。</p>

				<h3>5. 免责声明</h3>
				<p>本应用按"现状"提供服务，不提供任何明示或暗示的保证。对于因使用本应用而产生的任何直接或间接损失，我们不承担任何责任。</p>

				<h3>6. 服务变更、中断或终止</h3>
				<p>我们保留随时修改或中断服务的权利，无需对用户或第三方负责。此外，如果我们认为用户违反了本协议，有权暂停或终止向其提供服务。</p>

				<h3>7. 隐私保护</h3>
				<p>我们重视用户隐私保护。关于我们如何收集、使用、存储用户信息的详细内容，请参阅《隐私政策》。</p>

				<h3>8. 法律适用</h3>
				<p>本协议的订立、执行和解释均适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，任何一方均可向我们所在地人民法院提起诉讼。</p>

				<h3>9. 协议更新</h3>
				<p>我们有权随时修改本协议，修改后的协议一经发布即生效。如用户不同意修改后的协议，应停止使用本应用。继续使用本应用即表示用户接受修改后的协议。</p>

				<h3>10. 联系方式</h3>
				<p>如您对本协议有任何疑问，请通过应用内的反馈功能联系我们。</p>

				<div class="update-time">
					<p>最后更新日期：2026年1月10日</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import BackNavBar from '@/components/common/BackNavBar.vue'
</script>

<style scoped>
.agreement-page {
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
}
</style>
