<template>
	<div class="tag-container">
		<el-card>
			<div slot="header">
				<div class="header-actions">
					<span>标签管理</span>
					<el-button type="primary" @click="handleAdd">新增标签</el-button>
				</div>
			</div>

			<el-table :data="tags" border>
				<el-table-column prop="id" label="ID" width="80"></el-table-column>
				<el-table-column prop="name" label="标签名称"></el-table-column>
				<el-table-column prop="description" label="描述"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="180">
					<template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 新增/编辑弹窗 -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="标签名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入标签名称"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input type="textarea" v-model="form.description" placeholder="请输入标签描述"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getTagList,
		createTag,
		updateTag,
		deleteTag
	} from '/src/api/tag.js'

	export default {
		name: 'TagList',
		data() {
			return {
				tags: [],
				dialogVisible: false,
				dialogTitle: '新增标签',
				form: {
					id: null,
					name: '',
					description: ''
				},
				rules: {
					name: [{
							required: true,
							message: '请输入标签名称',
							trigger: 'blur'
						},
						{
							max: 50,
							message: '标签名称不能超过50个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		created() {
			this.loadTags()
		},
		methods: {
			// 加载标签列表
			loadTags() {
				getTagList().then(res => {
					this.tags = res.data
				}).catch(err => {
					this.$message.error('加载标签失败: ' + err.message)
				})
			},

			// 新增标签
			handleAdd() {
				this.dialogTitle = '新增标签'
				this.form = {
					id: null,
					name: '',
					description: ''
				}
				this.dialogVisible = true
			},

			// 编辑标签
			handleEdit(row) {
				this.dialogTitle = '编辑标签'
				this.form = {
					...row
				}
				this.dialogVisible = true
			},

			// 提交表单
			submitForm() {
				this.$refs.form.validate(valid => {
					if (valid) {
						if (this.form.id) {
							// 更新标签
							updateTag(this.form.id, this.form).then(() => {
								this.$message.success('更新成功')
								this.dialogVisible = false
								this.loadTags()
							}).catch(err => {
								this.$message.error('更新失败: ' + err.message)
							})
						} else {
							// 创建标签
							createTag(this.form).then(() => {
								this.$message.success('创建成功')
								this.dialogVisible = false
								this.loadTags()
							}).catch(err => {
								this.$message.error('创建失败: ' + err.message)
							})
						}
					}
				})
			},

			// 删除标签
			handleDelete(id) {
				this.$confirm('确定要删除该标签吗?', '提示', {
					type: 'warning'
				}).then(() => {
					deleteTag(id).then(() => {
						this.$message.success('删除成功')
						this.loadTags()
					}).catch(err => {
						this.$message.error('删除失败: ' + err.message)
					})
				})
			}
		},
		filters: {
			dateFormat(value) {
				if (!value) return ''
				return new Date(value).toLocaleString()
			}
		}
	}
</script>

<style scoped>
	.header-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>