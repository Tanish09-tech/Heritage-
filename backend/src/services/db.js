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
              idType: 'Aadhaar Card',
              idNumber: '4829-1029-3847',
              idProofFileName: 'aniket_aadhaar_card.pdf',
              idVerified: true,
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
              idType: 'Voter ID',
              idNumber: 'PBV9823412',
              idProofFileName: 'simran_voter_id.pdf',
              idVerified: true,
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
              idType: 'PAN Card',
              idNumber: 'APATE7890K',
              idProofFileName: 'aarav_pan_card.jpg',
              idVerified: true,
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
              idType: 'Aadhaar Card',
              idNumber: '9012-3456-7890',
              idProofFileName: 'meera_aadhaar.pdf',
              idVerified: true,
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
              idType: 'Aadhaar Card',
              idNumber: '3456-7890-1234',
              idProofFileName: 'bishal_aadhaar.pdf',
              idVerified: true,
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
              idType: 'Aadhaar Card',
              idNumber: '8910-2345-6789',
              idProofFileName: 'shahir_jagtap_aadhaar.pdf',
              idVerified: true,
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
              idType: 'Voter ID',
              idNumber: 'PBV4567890',
              idProofFileName: 'ustad_harinder_voterid.pdf',
              idVerified: true,
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
              idType: 'PAN Card',
              idNumber: 'PRJOS5678L',
              idProofFileName: 'raghunath_pan_card.jpg',
              idVerified: true,
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
              idType: 'Aadhaar Card',
              idNumber: '6789-0123-4567',
              idProofFileName: 'guru_nair_aadhaar.pdf',
              idVerified: true,
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
              idType: 'Aadhaar Card',
              idNumber: '1234-5678-9012',
              idProofFileName: 'hemlata_aadhaar.pdf',
              idVerified: true,
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
              idType: 'Government Admin ID',
              idNumber: 'GOV-IND-2026-9812',
              idProofFileName: 'admin_official_identity.pdf',
              idVerified: true,
              profileCompleted: true,
              createdAt: new Date().toISOString()
            }
          ],
          applications: [
            {
              id: 'app-1788760905164',
              learnerId: 'user-shishya-01',
              learnerName: 'Aniket Deshmukh',
              practitionerId: 'mp-3',
              practitionerName: 'Pandit Raghunath Joshi',
              tradition: 'Bhavai Folk Theatre',
              note: 'Respected Pandit Raghunath Joshi ji, I am eager to learn Bhavai Folk Theatre under your guidance.',
              status: 'ACCEPTED',
              submittedAt: '2026-09-07T06:01:45.164Z'
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
        idType: 'Aadhaar Card',
        idNumber: '8823-4412-9901',
        idProofFileName: 'aadhaar_aniket_deshmukh.pdf',
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
        idType: 'Voter ID',
        idNumber: 'PB99882231',
        idProofFileName: 'voter_id_simran_kaur.pdf',
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
        idType: 'PAN Card',
        idNumber: 'ABCDE5678G',
        idProofFileName: 'pan_aarav_patel.pdf',
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
        idType: 'Aadhaar Card',
        idNumber: '9912-3344-5566',
        idProofFileName: 'aadhaar_meera_menon.pdf',
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
        idType: 'Voter ID',
        idNumber: 'AS44556677',
        idProofFileName: 'voter_id_bishal_saikia.pdf',
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
        idType: 'Aadhaar Card',
        idNumber: '7723-1188-4490',
        idProofFileName: 'aadhaar_shahir_tukaram.pdf',
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
        idType: 'PAN Card',
        idNumber: 'HARIS7788K',
        idProofFileName: 'pan_harinder_singh.pdf',
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
        idType: 'Aadhaar Card',
        idNumber: '5566-7788-9900',
        idProofFileName: 'aadhaar_raghunath_joshi.pdf',
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
        idType: 'Voter ID',
        idNumber: 'KL88776655',
        idProofFileName: 'voter_id_manikandan_nair.pdf',
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
        idType: 'Aadhaar Card',
        idNumber: '3344-5566-7788',
        idProofFileName: 'aadhaar_hemlata_gogoi.pdf',
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
