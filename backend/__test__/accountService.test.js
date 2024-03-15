const accountService = require("../src/util/accountAccess/accountService")
const userDAO = require("../src/repository/userDAO");

jest.mock("../src/repository/userDAO")


describe('Registration Test', () => {
    
    beforeEach(() => userDAO.registerUser.mockClear())
    test('Successful Creation', async () =>{
        userDAO.getUser.mockReturnValue({Items: []})
        userDAO.registerUser.mockReturnValue(["Success"])
        let data = {username: "username", password: "password"}

        const result = await accountService.registerUser(data);

        expect(userDAO.getUser).toHaveBeenCalled()
        expect(userDAO.registerUser).toHaveBeenCalled()
        expect(result[0]).toBe(201)
        expect(result[1]).toBe("Account Successfully created")
    })


    test('Another user already exists', async () =>{
        userDAO.getUser.mockReturnValue({Items: ["username"]})
        
        let data = { username: "username", password: "password" }

        const result = await accountService.registerUser(data);

        expect(userDAO.getUser).toHaveBeenCalled()
        expect(userDAO.registerUser).not.toHaveBeenCalled()
        expect(result[0]).toBe(401)
        expect(result[1]).toBe("Username already in use")
    })

    test('Invalid password', async () =>{
        userDAO.getUser.mockReturnValue({ Items: [] })        
        let data = { username: "username", password: " " }

        const result = await accountService.registerUser(data);

        expect(userDAO.getUser).toHaveBeenCalled()
        expect(userDAO.registerUser).not.toHaveBeenCalled()
        expect(result[0]).toBe(401)
        expect(result[1]).toBe("Invalid password. Must be at least 5 characters with no spaces")
    })

    test('Invalid password2', async () =>{
        userDAO.getUser.mockReturnValue({ Items: [] })        
        let data = { username: "username", password: "" }

        const result = await accountService.registerUser(data);

        expect(userDAO.getUser).toHaveBeenCalled()
        expect(userDAO.registerUser).not.toHaveBeenCalled()
        expect(result[0]).toBe(401)
        expect(result[1]).toBe("Invalid password. Must be at least 5 characters with no spaces")
    })

    test('Invalid password3', async () =>{
        userDAO.getUser.mockReturnValue({ Items: [] })        
        let data = { username: "username", password: "short" }

        const result = await accountService.registerUser(data);

        expect(userDAO.getUser).toHaveBeenCalled()
        expect(userDAO.registerUser).not.toHaveBeenCalled()
        expect(result[0]).toBe(401)
        expect(result[1]).toBe("Invalid password. Must be at least 5 characters with no spaces")
    })

    test('Invalid username', async () =>{
        userDAO.getUser.mockReturnValue({ Items: [] })        
        let data = { username: "", password: "password" }

        const result = await accountService.registerUser(data);

        expect(userDAO.getUser).toHaveBeenCalled()
        expect(userDAO.registerUser).not.toHaveBeenCalled()
        expect(result[0]).toBe(401)
        expect(result[1]).toBe("Invalid userame. Must be less than 50 characters with no spaces")
    })

    test('Invalid username2', async () =>{
        userDAO.getUser.mockReturnValue({ Items: [] })        
        let data = { username: " ", password: "password" }

        const result = await accountService.registerUser(data);

        expect(userDAO.getUser).toHaveBeenCalled()
        expect(userDAO.registerUser).not.toHaveBeenCalled()
        expect(result[0]).toBe(401)
        expect(result[1]).toBe("Invalid userame. Must be less than 50 characters with no spaces")
    })

})