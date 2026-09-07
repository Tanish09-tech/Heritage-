import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  PILOT_TRADITIONS, 
  MASTER_PRACTITIONERS, 
  LEARNER_PROFILES, 
  VALIDATION_QUEUE, 
  ARCHIVED_KNOWLEDGE_ITEMS 
} from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../data/db.json');

class JSONDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        // Bootstrap with seed data
        this.data = {
          traditions: PILOT_TRADITIONS || [],
          practitioners: MASTER_PRACTITIONERS || [],
          learners: LEARNER_PROFILES || [],
          validationQueue: VALIDATION_QUEUE || [],
          knowledgeVault: ARCHIVED_KNOWLEDGE_ITEMS || [],
          users: [
            // 1. Shishya 1
            {
              id: 'user-shishya-01',
              email: 'shishya1@sanskriti.gov.in',
              password: 'password123',
              name: 'Aniket Deshmukh',
              role: 'LEARNER',
              dob: '2002-05-15',
              hobbies: 'Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads',
              state: 'Maharashtra',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 2. Shishya 2
            {
              id: 'user-shishya-02',
              email: 'shishya2@sanskriti.gov.in',
              password: 'password123',
              name: 'Simran Kaur',
              role: 'LEARNER',
              dob: '2003-11-20',
              hobbies: 'Phulkari folk embroidery, Giddha folk dance, Punjabi folk music',
              state: 'Punjab',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 3. Shishya 3
            {
              id: 'user-shishya-03',
              email: 'shishya3@sanskriti.gov.in',
              password: 'password123',
              name: 'Aarav Patel',
              role: 'LEARNER',
              dob: '2001-09-10',
              hobbies: 'Bhavai vesha acting, Garba drumming, Kutchi embroidery',
              state: 'Gujarat',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 4. Shishya 4
            {
              id: 'user-shishya-04',
              email: 'shishya4@sanskriti.gov.in',
              password: 'password123',
              name: 'Meera Menon',
              role: 'LEARNER',
              dob: '2004-03-08',
              hobbies: 'Koodiyattam facial expressions, Mizhavu drumming, Mohiniyattam',
              state: 'Kerala',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 5. Shishya 5
            {
              id: 'user-shishya-05',
              email: 'shishya5@sanskriti.gov.in',
              password: 'password123',
              name: 'Bishal Saikia',
              role: 'LEARNER',
              dob: '2002-12-14',
              hobbies: 'Bihu Dhol playing, Pepa flute, Assamese oral legends',
              state: 'Assam',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 6. Guru 1
            {
              id: 'user-guru-01',
              email: 'guru1@sanskriti.gov.in',
              password: 'password123',
              name: 'Shahir Tukaram Jagtap',
              role: 'PRACTITIONER',
              dob: '1968-08-20',
              state: 'Maharashtra',
              experience: '28 Years of continuous Shahiri Akhada & Daf oral tradition',
              expertTradition: 'Shahiri Powada (Oral Ballads)',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 7. Guru 2
            {
              id: 'user-guru-02',
              email: 'guru2@sanskriti.gov.in',
              password: 'password123',
              name: 'Ustad Harinder Singh',
              role: 'PRACTITIONER',
              dob: '1965-03-12',
              state: 'Punjab',
              experience: '32 Years of traditional Gatka Shastar Vidiya & folk rhythms',
              expertTradition: 'Baisakhi & Gatka Martial Art',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 8. Guru 3
            {
              id: 'user-guru-03',
              email: 'guru3@sanskriti.gov.in',
              password: 'password123',
              name: 'Pandit Raghunath Joshi',
              role: 'PRACTITIONER',
              dob: '1970-11-05',
              state: 'Gujarat',
              experience: '25 Years of Bhavai Folk Theatre & Garba compositions',
              expertTradition: 'Bhavai Folk Theatre',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 9. Guru 4
            {
              id: 'user-guru-04',
              email: 'guru4@sanskriti.gov.in',
              password: 'password123',
              name: 'Guru Manikandan Nair',
              role: 'PRACTITIONER',
              dob: '1967-04-18',
              state: 'Kerala',
              experience: '30 Years of Koodiyattam Sanskrit Theatre & Mudras',
              expertTradition: 'Koodiyattam Sanskrit Theatre',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 10. Guru 5
            {
              id: 'user-guru-05',
              email: 'guru5@sanskriti.gov.in',
              password: 'password123',
              name: 'Shrimati Hemlata Gogoi',
              role: 'PRACTITIONER',
              dob: '1972-09-25',
              state: 'Assam',
              experience: '22 Years of Bihu Folk Dance & Muga Silk Weaving',
              expertTradition: 'Rongali Bihu & Folk Instruments',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            },
            // 11. Admin
            {
              id: 'user-admin-01',
              email: 'admin@sanskriti.gov.in',
              password: 'adminpassword123',
              name: 'Dr. Rajesh Sharma',
              role: 'AUTHORITY',
              state: 'Delhi',
              designation: 'Director of Living Heritage, Ministry of Culture',
              clearance: 'National Level-4 Cultural Administrator',
              profileCompleted: true,
              createdAt: new Date().toISOString()
            }
          ],
          applications: [
            {
              id: 'app-01',
              learnerId: 'user-learner-01',
              learnerName: 'Aniket Deshmukh',
              practitionerId: 'mp-1',
              practitionerName: 'Shahir Tukaram Jagtap',
              tradition: 'Shahiri Powada',
              status: 'ACCEPTED',
              submittedAt: '2026-08-10T10:00:00Z'
            }
          ]
        };
      }
      this.ensureFixedUsers();
      this.persist();
    } catch (err) {
      console.error('Failed to initialize database:', err);
      this.data = {
        traditions: PILOT_TRADITIONS || [],
        practitioners: MASTER_PRACTITIONERS || [],
        learners: LEARNER_PROFILES || [],
        validationQueue: VALIDATION_QUEUE || [],
        knowledgeVault: ARCHIVED_KNOWLEDGE_ITEMS || [],
        users: [],
        applications: []
      };
      this.ensureFixedUsers();
    }
  }

  ensureFixedUsers() {
    const fixedUsers = [
      // 1. Shishya 1
      {
        id: 'user-shishya-01',
        email: 'shishya1@sanskriti.gov.in',
        password: 'password123',
        name: 'Aniket Deshmukh',
        role: 'LEARNER',
        dob: '2002-05-15',
        hobbies: 'Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads',
        state: 'Maharashtra',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 2. Shishya 2
      {
        id: 'user-shishya-02',
        email: 'shishya2@sanskriti.gov.in',
        password: 'password123',
        name: 'Simran Kaur',
        role: 'LEARNER',
        dob: '2003-11-20',
        hobbies: 'Phulkari folk embroidery, Giddha folk dance, Punjabi folk music',
        state: 'Punjab',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 3. Shishya 3
      {
        id: 'user-shishya-03',
        email: 'shishya3@sanskriti.gov.in',
        password: 'password123',
        name: 'Aarav Patel',
        role: 'LEARNER',
        dob: '2001-09-10',
        hobbies: 'Bhavai vesha acting, Garba drumming, Kutchi embroidery',
        state: 'Gujarat',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 4. Shishya 4
      {
        id: 'user-shishya-04',
        email: 'shishya4@sanskriti.gov.in',
        password: 'password123',
        name: 'Meera Menon',
        role: 'LEARNER',
        dob: '2004-03-08',
        hobbies: 'Koodiyattam facial expressions, Mizhavu drumming, Mohiniyattam',
        state: 'Kerala',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 5. Shishya 5
      {
        id: 'user-shishya-05',
        email: 'shishya5@sanskriti.gov.in',
        password: 'password123',
        name: 'Bishal Saikia',
        role: 'LEARNER',
        dob: '2002-12-14',
        hobbies: 'Bihu Dhol playing, Pepa flute, Assamese oral legends',
        state: 'Assam',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 6. Guru 1
      {
        id: 'user-guru-01',
        email: 'guru1@sanskriti.gov.in',
        password: 'password123',
        name: 'Shahir Tukaram Jagtap',
        role: 'PRACTITIONER',
        dob: '1968-08-20',
        state: 'Maharashtra',
        experience: '28 Years of continuous Shahiri Akhada & Daf oral tradition',
        expertTradition: 'Shahiri Powada (Oral Ballads)',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 7. Guru 2
      {
        id: 'user-guru-02',
        email: 'guru2@sanskriti.gov.in',
        password: 'password123',
        name: 'Ustad Harinder Singh',
        role: 'PRACTITIONER',
        dob: '1965-03-12',
        state: 'Punjab',
        experience: '32 Years of traditional Gatka Shastar Vidiya & folk rhythms',
        expertTradition: 'Baisakhi & Gatka Martial Art',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 8. Guru 3
      {
        id: 'user-guru-03',
        email: 'guru3@sanskriti.gov.in',
        password: 'password123',
        name: 'Pandit Raghunath Joshi',
        role: 'PRACTITIONER',
        dob: '1970-11-05',
        state: 'Gujarat',
        experience: '25 Years of Bhavai Folk Theatre & Garba compositions',
        expertTradition: 'Bhavai Folk Theatre',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 9. Guru 4
      {
        id: 'user-guru-04',
        email: 'guru4@sanskriti.gov.in',
        password: 'password123',
        name: 'Guru Manikandan Nair',
        role: 'PRACTITIONER',
        dob: '1967-04-18',
        state: 'Kerala',
        experience: '30 Years of Koodiyattam Sanskrit Theatre & Mudras',
        expertTradition: 'Koodiyattam Sanskrit Theatre',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 10. Guru 5
      {
        id: 'user-guru-05',
        email: 'guru5@sanskriti.gov.in',
        password: 'password123',
        name: 'Shrimati Hemlata Gogoi',
        role: 'PRACTITIONER',
        dob: '1972-09-25',
        state: 'Assam',
        experience: '22 Years of Bihu Folk Dance & Muga Silk Weaving',
        expertTradition: 'Rongali Bihu & Folk Instruments',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // 11. Admin
      {
        id: 'user-admin-01',
        email: 'admin@sanskriti.gov.in',
        password: 'adminpassword123',
        name: 'Dr. Rajesh Sharma',
        role: 'AUTHORITY',
        state: 'Delhi',
        designation: 'Director of Living Heritage, Ministry of Culture',
        clearance: 'National Level-4 Cultural Administrator',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      // Aliases
      {
        id: 'user-shishya-alias',
        email: 'shishya.aniket@gmail.com',
        password: 'password123',
        name: 'Aniket Deshmukh',
        role: 'LEARNER',
        dob: '2002-05-15',
        hobbies: 'Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads',
        state: 'Maharashtra',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-guru-alias',
        email: 'guru.tukaram@gmail.com',
        password: 'password123',
        name: 'Shahir Tukaram Jagtap',
        role: 'PRACTITIONER',
        dob: '1968-08-20',
        state: 'Maharashtra',
        experience: '28 Years of continuous Shahiri Akhada & Daf oral tradition',
        expertTradition: 'Shahiri Powada (Oral Ballads)',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-admin-alias',
        email: 'admin.sanskriti@gov.in',
        password: 'adminpassword123',
        name: 'Ministry Heritage Authority',
        role: 'AUTHORITY',
        profileCompleted: true,
        createdAt: new Date().toISOString()
      }
    ];

    if (!this.data.users) this.data.users = [];
    for (const fu of fixedUsers) {
      const idx = this.data.users.findIndex(u => u.email?.toLowerCase() === fu.email.toLowerCase() && u.role === fu.role);
      if (idx === -1) {
        this.data.users.push(fu);
      } else {
        this.data.users[idx] = { ...fu, ...this.data.users[idx] };
      }
    }
  }

  persist() {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  getCollection(collection) {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      }
    } catch (e) {
      // Fallback to in-memory state
    }
    return this.data[collection] || [];
  }

  getById(collection, id) {
    const list = this.getCollection(collection);
    return list.find(item => item.id === id || String(item.id) === String(id)) || null;
  }

  saveUser(userObj) {
    if (!this.data.users) this.data.users = [];
    const normalizedEmail = userObj.email?.toLowerCase();
    const idx = this.data.users.findIndex(u => 
      u.email?.toLowerCase() === normalizedEmail && (!userObj.role || u.role === userObj.role)
    );
    if (idx !== -1) {
      this.data.users[idx] = {
        ...this.data.users[idx],
        ...userObj,
        profileCompleted: true
      };
      this.persist();
      return this.data.users[idx];
    } else {
      const newUser = {
        id: userObj.id || `user-${Date.now()}`,
        ...userObj,
        profileCompleted: true,
        createdAt: new Date().toISOString()
      };
      this.data.users.unshift(newUser);
      this.persist();
      return newUser;
    }
  }

  create(collection, item) {
    if (collection === 'users') {
      return this.saveUser(item);
    }
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newItem = {
      ...item,
      id: item.id || `${collection.slice(0, 3)}-${Date.now()}`
    };
    this.data[collection].unshift(newItem);
    this.persist();
    return newItem;
  }

  update(collection, id, updates) {
    const list = this.getCollection(collection);
    const index = list.findIndex(item => item.id === id || String(item.id) === String(id));
    if (index === -1) return null;
    const updated = {
      ...list[index],
      ...updates
    };
    this.data[collection][index] = updated;
    this.persist();
    return updated;
  }

  delete(collection, id) {
    const list = this.getCollection(collection);
    const initialLen = list.length;
    this.data[collection] = list.filter(item => item.id !== id && String(item.id) !== String(id));
    const deleted = this.data[collection].length < initialLen;
    if (deleted) this.persist();
    return deleted;
  }
}

export const db = new JSONDatabase();
