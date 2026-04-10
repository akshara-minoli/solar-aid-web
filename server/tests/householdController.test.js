import { jest } from '@jest/globals';
import { addHousehold } from '../controllers/householdController.js';
import Household from '../models/Household.js';

describe('Household Controller Unit Tests', () => {
  let req;
  let res;
  let createSpy;

  beforeEach(() => {
    req = {
      user: { _id: 'testUserId' },
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
    createSpy = jest.spyOn(Household, 'create');
  });

  afterEach(() => {
    createSpy.mockRestore();
  });

  describe('addHousehold', () => {
    it('should return 400 if roofArea is invalid', async () => {
      req.body = { roofArea: 'invalid', members: 4 };

      await addHousehold(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/valid roof area/i) })
      );
    });

    it('should return 400 if roofArea is less than or equal to 0', async () => {
      req.body = { roofArea: 0, members: 4 };

      await addHousehold(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if members is invalid', async () => {
      req.body = { roofArea: 100, members: 'invalid' };

      await addHousehold(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/valid number of members/i) })
      );
    });

    it('should create household successfully and return 201', async () => {
      req.body = {
        houseName: 'My House',
        houseType: 'Standalone',
        roofArea: 120.5,
        district: 'Colombo',
        members: 5,
        houseAddress: '123 Test St',
        appliances: []
      };

      const mockHousehold = { _id: 'householdId', ...req.body };
      createSpy.mockResolvedValue(mockHousehold);

      await addHousehold(req, res);

      expect(createSpy).toHaveBeenCalledWith({
        userId: 'testUserId',
        houseName: 'My House',
        houseType: 'Standalone',
        roofArea: 120.5,
        district: 'Colombo',
        members: 5,
        houseAddress: '123 Test St',
        appliances: []
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          household: mockHousehold
        })
      );
    });
  });
});

