import React, { useState } from 'react'
import { Button, Text } from '@chakra-ui/react'
import { useTeam } from '../../components/context/TeamContext'
import type { CreateTeamData } from '../services/team'

interface CreateTeamModalProps {
	isOpen: boolean
	onClose: () => void
	onTeamCreated?: (teamName: string) => void
	onError?: () => void
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
	isOpen,
	onClose,
	onTeamCreated = () => {},
	onError = () => {},
}) => {
	const [formData, setFormData] = useState<CreateTeamData>({
		name: '',
		description: '',
	})
	const [errors, setErrors] = useState<{ name?: string }>({})
	const [isLoading, setIsLoading] = useState(false)

	const { createTeam } = useTeam()

	const validateForm = (): boolean => {
		const newErrors: { name?: string } = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Nome do time é obrigatório'
		} else if (formData.name.trim().length < 2) {
			newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
		} else if (formData.name.trim().length > 50) {
			newErrors.name = 'Nome deve ter no máximo 50 caracteres'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

		setIsLoading(true)

		try {
			const newTeam = await createTeam({
				name: formData.name.trim(),
				description: (formData.description ?? '').trim() || undefined,
			})

			onTeamCreated(newTeam.name)
			handleClose()
		} catch {
			onError()
		} finally {
			setIsLoading(false)
		}
	}

	const handleClose = () => {
		setFormData({ name: '', description: '' })
		setErrors({})
		setIsLoading(false)
		onClose()
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))

		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }))
		}
	}

	if (!isOpen) return null

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0,0,0,0.5)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
			}}
		>
			<div
				style={{
					backgroundColor: 'white',
					borderRadius: '8px',
					width: '100%',
					maxWidth: '500px',
					boxShadow:
						'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				}}
			>
				<div
					style={{
						padding: '16px 24px',
						borderBottom: '1px solid #e2e8f0',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
						Criar Novo Time
					</h2>
					<button
						onClick={handleClose}
						style={{
							background: 'none',
							border: 'none',
							fontSize: '1.25rem',
							cursor: 'pointer',
						}}
					>
						&times;
					</button>
				</div>

				<div style={{ padding: '24px' }}>
					<form onSubmit={handleSubmit}>
						<div
							style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
						>
							<div style={{ marginBottom: '16px' }}>
								<label
									htmlFor='name'
									style={{
										display: 'block',
										marginBottom: '8px',
										fontWeight: '500',
									}}
								>
									Nome do Time *
								</label>
								<input
									id='name'
									name='name'
									type='text'
									placeholder='Digite o nome do seu time'
									value={formData.name}
									onChange={handleInputChange}
									maxLength={50}
									style={{
										width: '100%',
										padding: '8px 12px',
										borderRadius: '4px',
										border: errors.name
											? '1px solid #e53e3e'
											: '1px solid #e2e8f0',
										fontSize: '1rem',
									}}
								/>
								{errors.name && (
									<Text
										color='red.500'
										fontSize='sm'
										mt={1}
									>
										{errors.name}
									</Text>
								)}
							</div>

							<div style={{ marginBottom: '16px' }}>
								<label
									htmlFor='description'
									style={{
										display: 'block',
										marginBottom: '8px',
										fontWeight: '500',
									}}
								>
									Descrição (Opcional)
								</label>
								<textarea
									id='description'
									name='description'
									placeholder='Descreva seu time ou estratégia...'
									value={formData.description}
									onChange={handleInputChange}
									maxLength={200}
									rows={3}
									style={{
										width: '100%',
										padding: '8px 12px',
										borderRadius: '4px',
										border: '1px solid #e2e8f0',
										fontSize: '1rem',
										resize: 'none',
									}}
								/>
								<Text
									fontSize='xs'
									color='gray.500'
									mt={1}
								>
									{formData.description?.length ?? 0}/200 caracteres
								</Text>
							</div>
						</div>
					</form>
				</div>

				<div
					style={{
						padding: '16px 24px',
						borderTop: '1px solid #e2e8f0',
						display: 'flex',
						justifyContent: 'flex-end',
						gap: '12px',
					}}
				>
					<button
						onClick={handleClose}
						disabled={isLoading}
						style={{
							padding: '8px 16px',
							borderRadius: '4px',
							border: '1px solid #e2e8f0',
							background: 'white',
							cursor: 'pointer',
							opacity: isLoading ? 0.5 : 1,
						}}
					>
						Cancelar
					</button>
					<Button
						colorScheme='blue'
						onClick={handleSubmit}
						loading={isLoading}
						loadingText='Criando...'
						disabled={!formData.name.trim()}
					>
						Criar Time
					</Button>
				</div>
			</div>
		</div>
	)
}

export default CreateTeamModal
