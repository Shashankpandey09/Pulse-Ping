import { SignInButton,  useUser, UserButton } from '@clerk/clerk-react';

export default function Header() {
  const { isSignedIn,user } = useUser();

  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
      {isSignedIn ? (
        <>
        <div className='flex gap-2'>
          <h1>{user.firstName}</h1>
          <UserButton />
          </div>
      
        </>
      ) : (
        <SignInButton mode="modal">
          <button className='bg-white cursor-pointer text-black px-4 py-2 rounded hover:bg-gray-200 transition'>Sign In</button>
        </SignInButton>
      )}
    </header>
  );
}
