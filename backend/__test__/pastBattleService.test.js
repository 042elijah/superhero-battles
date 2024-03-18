const pastBattleService = require("../src/service/pastBattleService")
const pastBattleDAO = require("../src/repository/pastBattleDAO");
const userDao = require('../src/repository/userDAO');
const apiHeroService = require('../src/service/apiHeroService');
const customHeroService = require('../src/service/customHeroService');
const userService = require('../src/service/userService');

jest.mock("../src/repository/userDAO")
jest.mock("../src/service/userService")
jest.mock("../src/util/validate")
jest.mock("../src/repository/pastBattleDAO")
jest.mock("../src/service/apiHeroService")
jest.mock("../src/service/customHeroService")
jest.mock("../src/service/pastBattleService")

describe('Get Past Battle by username and/or battle ID Test', () => {
   
    beforeEach(() => pastBattleDAO.getPastBattleByUsername.mockClear());
    beforeEach(() => pastBattleDAO.getPastBattleByBattleID.mockClear());
    
    test('get record by username', async () => {
        pastBattleDAO.getPastBattleByUsername.mockReturnValue("OK");
        
        const res = await pastBattleService.getPastBattleByUsername("Rumi");
        
        expect(pastBattleDAO.getPastBattleByUsername).toHaveBeenCalledTimes(1);
  
        expect(res).toEqual("OK");
    })

    test('get record by username and id', async () => {
        pastBattleDAO.getPastBattleByBattleID.mockReturnValue("OK");
        
        const res = await pastBattleService.getPastBattleByBattleID("Rumi", "12");
        
        expect(pastBattleDAO.getPastBattleByBattleID).toHaveBeenCalledTimes(1);
  
        expect(res).toEqual("OK");
    })

});

describe('Simulate Battle Test', () => {
   
    beforeEach(() => pastBattleDAO.mockClear());
    
    test('get record by username', async () => {
        pastBattleDAO.getPastBattleByUsername.mockReturnValue("OK");
        
        const res = await pastBattleService.getPastBattleByUsername("Rumi");
        
        expect(pastBattleDAO.getPastBattleByUsername).toHaveBeenCalledTimes(1);
  
        expect(res).toEqual("OK");
    })

    test('get record by username and id', async () => {
        pastBattleDAO.getPastBattleByBattleID.mockReturnValue("OK");
        
        const res = await pastBattleService.getPastBattleByBattleID("Rumi", "12");
        
        expect(pastBattleDAO.getPastBattleByBattleID).toHaveBeenCalledTimes(1);
  
        expect(res).toEqual("OK");
    })

});