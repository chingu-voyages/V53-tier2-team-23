function Management({ username }) {
  return (
    <div>
      <h1 className='font-shantell'>Welcome {username}!</h1>
      <div>
        <p className='font-shantell'>Plan your weekly menu</p>
        <div className='group relative flex flex-col'>
          <p className='border-secondary border-2 rounded-full w-fit px-16'>
            Menus
          </p>
          <div className='hidden group-hover:flex flex-col gap-3 mt-2 w-fit'>
            <button>Generate Menus</button>
            <button>View Menus</button>
          </div>
        </div>
      </div>
      <div>
        <p className='font-shantell'>Need to edit allergies of an employee?</p>
        <div className='group relative flex flex-col'>
          <p className='border-secondary border-2 rounded-full w-fit px-16'>
            Allergies
          </p>
          <div className='hidden group-hover:flex flex-col gap-3 mt-2 w-fit'>
            <button>Select an Employee</button>
            <button>Add an Employee</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;
