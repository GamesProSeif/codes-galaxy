<template>
<div class="mb-4">
	<b-navbar fixed="top" toggleable="lg" type="dark" variant="primary">
		<b-navbar-brand href="/">Codes</b-navbar-brand>

		<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

		<b-collapse id="nav-collapse" is-nav>
			<!-- Right aligned nav items -->
			<b-navbar-nav class="ml-auto">
				<b-navbar-nav>
				<b-nav-item href="/">Home</b-nav-item>
				<b-nav-item href="/about">About</b-nav-item>
				<b-nav-item href="/login">Login</b-nav-item>
			</b-navbar-nav>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</div>
</template>

<script>
export default {
	name: 'Navbar'
}
</script>

<style>
</style>
