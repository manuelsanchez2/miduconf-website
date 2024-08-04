import { ShimmerButton } from '@/components/magicui/ShimmerButton'
import Ticket from '@/components/Ticket'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { FLAVORS } from '@/flavors/data'
import { Button } from '@/components/Button'
import { TicketIcon } from '@/components/icons'

export const TicketHome = ({ ticketNumber, username, initialFlavor }) => {
	const supabase = useSupabaseClient()
	const [flavor, setFlavor] = useState(FLAVORS[initialFlavor] ?? FLAVORS.javascript)
	const [number, setNumber] = useState(ticketNumber ?? 0)

	useEffect(() => {
		if (initialFlavor) return

		const keys = Object.keys(FLAVORS)
		const length = keys.length

		const intervalId = setInterval(() => {
			// get a random key from FLAVORS object
			const randomKey = keys[Math.floor(Math.random() * length)]
			setFlavor(FLAVORS[randomKey])
		}, 2500)

		return () => {
			clearInterval(intervalId)
		}
	}, [])

	useEffect(() => {
		if (ticketNumber) return

		fetch('/api/number')
			.then((res) => res.json())
			.then((response) => {
				setNumber(+response.number + 100)
			})
	}, [])

	const handleLogin = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo:
					process.env.NODE_ENV !== 'production'
						? 'http://localhost:3000/api/auth/callback'
						: 'https://miduconf.com/api/auth/callback'
			}
		})
	}

	const handleGoToDiscord = () => {
		window.open('https://discord.gg/qNqRXh3f?event=1146458434682748939', '_blank')
	}

	return (
		<div>
			<div className='block w-full h-full'>
				<div className='flex items-center justify-center max-w-[668px] mx-auto mt-16 flex-0'>
					<Ticket
						transition={!initialFlavor}
						number={number}
						flavor={flavor}
						user={{
							avatar: username ? `https://unavatar.io/github/${username}` : null,
							username
						}}
					/>
				</div>
				<div className='flex flex-col items-center justify-center gap-4 mx-auto mt-16 scale-90 md:flex-row sm:scale-100'>
					<Button
						onClick={handleLogin}
						className='px-6 py-5 text-lg font-bold md:text-3xl rounded-xl'
					>
						<TicketIcon className='mr-3' />
						Conseguir mi ticket
					</Button>
				</div>
			</div>
		</div>
	)
}
