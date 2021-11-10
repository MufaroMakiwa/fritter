const data = [
  {
    likeId: 'e1ae5f24-a68a-4e28-9ed5-207a6f8a380e',
    freetId: '8533a744-fcee-4bc7-8e3b-5b4d3e1bf924',
    userId: '59ff8699-f56d-468b-93c7-6bfebf6578c4',
    authorId: '62cc4fe2-18c5-41d9-8ed2-66586ce2b484',
    dateAdded: new Date('2021-11-10T20:43:31.084Z'),
    notificationStatus: 'SEEN'
  },
  {
    likeId: '08699630-67e4-4e4d-bba4-d3393af2bfc6',
    freetId: '05db7526-86d4-4b82-955a-a332c63bbf00',
    userId: '59ff8699-f56d-468b-93c7-6bfebf6578c4',
    authorId: '574d89c5-4767-4175-9a3f-dddd28464467',
    dateAdded: new Date('2021-11-10T20:46:15.132Z'),
    notificationStatus: 'SEEN'
  },
  {
    likeId: 'b737414e-6edb-4e51-acb4-3578d1f3f4fb',
    freetId: '8533a744-fcee-4bc7-8e3b-5b4d3e1bf924',
    userId: '1f3fcb86-c38d-45d1-9bc3-1636de51d1a5',
    authorId: '62cc4fe2-18c5-41d9-8ed2-66586ce2b484',
    dateAdded: new Date('2021-11-10T20:46:20.456Z'),
    notificationStatus: 'SEEN'
  },
  {
    likeId: 'cf7f7b24-fa76-4720-9ab8-94607aa474ac',
    freetId: 'de9604ef-ded4-4c42-a22c-a9a39c7da07d',
    userId: 'daabfab2-941d-4212-9310-b5518adc3a94',
    authorId: 'daabfab2-941d-4212-9310-b5518adc3a94',
    dateAdded: new Date('2021-11-10T20:46:30.580Z'),
    notificationStatus: 'OPENED'
  },
  {
    likeId: '784dc87f-bf9e-4049-a723-8686dc7a5842',
    freetId: '05db7526-86d4-4b82-955a-a332c63bbf00',
    userId: '62cc4fe2-18c5-41d9-8ed2-66586ce2b484',
    authorId: '574d89c5-4767-4175-9a3f-dddd28464467',
    dateAdded: new Date('2021-11-10T20:48:36.359Z'),
    notificationStatus: 'SEEN'
  },
  {
    likeId: '27a89596-e250-49a0-9d01-1642025c50a9',
    freetId: '820219a1-a09f-48e0-ae45-cbcce9501ff7',
    userId: '62cc4fe2-18c5-41d9-8ed2-66586ce2b484',
    authorId: '1f3fcb86-c38d-45d1-9bc3-1636de51d1a5',
    dateAdded: new Date('2021-11-10T20:48:39.018Z'),
    notificationStatus: 'SEEN'
  },
  {
    likeId: '25068cd1-e4fe-41d9-ae94-7c02989669bb',
    freetId: '4b5b36f1-bbef-404b-821f-117743616d98',
    userId: '1f3fcb86-c38d-45d1-9bc3-1636de51d1a5',
    authorId: '59ff8699-f56d-468b-93c7-6bfebf6578c4',
    dateAdded: new Date('2021-11-10T20:49:20.550Z'),
    notificationStatus: 'SEEN'
  },
  {
    likeId: '14c2e8c3-0e85-45fc-bae9-39328f3e58cc',
    freetId: 'de9604ef-ded4-4c42-a22c-a9a39c7da07d',
    userId: '1f3fcb86-c38d-45d1-9bc3-1636de51d1a5',
    authorId: 'daabfab2-941d-4212-9310-b5518adc3a94',
    dateAdded: new Date('2021-11-10T20:49:23.616Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: '7ceb16f2-1907-4dfa-89f4-3630acd22eb4',
    freetId: '05db7526-86d4-4b82-955a-a332c63bbf00',
    userId: '574d89c5-4767-4175-9a3f-dddd28464467',
    authorId: '574d89c5-4767-4175-9a3f-dddd28464467',
    dateAdded: new Date('2021-11-10T20:49:29.334Z'),
    notificationStatus: 'OPENED'
  },
  {
    likeId: 'f6471863-18c9-4356-9bde-afd9a00ff14f',
    freetId: 'de9604ef-ded4-4c42-a22c-a9a39c7da07d',
    userId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    authorId: 'daabfab2-941d-4212-9310-b5518adc3a94',
    dateAdded: new Date('2021-11-10T20:52:18.725Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: '91890c89-397d-4aa3-be9c-87d524cdda1b',
    freetId: '820219a1-a09f-48e0-ae45-cbcce9501ff7',
    userId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    authorId: '1f3fcb86-c38d-45d1-9bc3-1636de51d1a5',
    dateAdded: new Date('2021-11-10T20:52:19.510Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: 'a0bacd05-99cc-478f-9f15-fdd113a6b839',
    freetId: '820219a1-a09f-48e0-ae45-cbcce9501ff7',
    userId: '574d89c5-4767-4175-9a3f-dddd28464467',
    authorId: '1f3fcb86-c38d-45d1-9bc3-1636de51d1a5',
    dateAdded: new Date('2021-11-10T20:52:49.235Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: 'ac482d11-b697-421b-97ff-d13e25851a09',
    freetId: '8533a744-fcee-4bc7-8e3b-5b4d3e1bf924',
    userId: 'daabfab2-941d-4212-9310-b5518adc3a94',
    authorId: '62cc4fe2-18c5-41d9-8ed2-66586ce2b484',
    dateAdded: new Date('2021-11-10T20:52:53.792Z'),
    notificationStatus: 'SEEN'
  },
  {
    likeId: '4880bcc1-f8ec-4eb5-82bb-ed7070bb95f2',
    freetId: '041b72da-8177-45bb-8f5e-c3d1283cbf64',
    userId: '62cc4fe2-18c5-41d9-8ed2-66586ce2b484',
    authorId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    dateAdded: new Date('2021-11-10T20:53:35.194Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: 'd8657ce5-3b09-4f85-bfd3-52850b5be053',
    freetId: '041b72da-8177-45bb-8f5e-c3d1283cbf64',
    userId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    authorId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    dateAdded: new Date('2021-11-10T20:53:46.867Z'),
    notificationStatus: 'OPENED'
  },
  {
    likeId: 'c0a3d483-e147-46b1-8472-931587faf06b',
    freetId: '041b72da-8177-45bb-8f5e-c3d1283cbf64',
    userId: 'daabfab2-941d-4212-9310-b5518adc3a94',
    authorId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    dateAdded: new Date('2021-11-10T20:53:58.005Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: '37efdf1a-836d-48ed-85ed-38483b5fd52f',
    freetId: '041b72da-8177-45bb-8f5e-c3d1283cbf64',
    userId: '59ff8699-f56d-468b-93c7-6bfebf6578c4',
    authorId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    dateAdded: new Date('2021-11-10T20:54:04.787Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: 'ddc80f78-35b3-4701-a882-a49c5f7d081a',
    freetId: '041b72da-8177-45bb-8f5e-c3d1283cbf64',
    userId: '1f3fcb86-c38d-45d1-9bc3-1636de51d1a5',
    authorId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    dateAdded: new Date('2021-11-10T20:54:10.062Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: '01edd839-d497-4b84-9450-c803608fede4',
    freetId: '041b72da-8177-45bb-8f5e-c3d1283cbf64',
    userId: '574d89c5-4767-4175-9a3f-dddd28464467',
    authorId: 'cee2e074-195a-404e-bc38-a3bb3a034764',
    dateAdded: new Date('2021-11-10T20:55:19.647Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: '95e5cb99-9107-4cf9-9dac-706bc8beabd9',
    freetId: '820219a1-a09f-48e0-ae45-cbcce9501ff7',
    userId: '59ff8699-f56d-468b-93c7-6bfebf6578c4',
    authorId: '1f3fcb86-c38d-45d1-9bc3-1636de51d1a5',
    dateAdded: new Date('2021-11-10T20:55:30.025Z'),
    notificationStatus: 'NEW'
  },
  {
    likeId: 'b980eb57-ccb5-4546-b57a-098be561ff31',
    freetId: '4b5b36f1-bbef-404b-821f-117743616d98',
    userId: '59ff8699-f56d-468b-93c7-6bfebf6578c4',
    authorId: '59ff8699-f56d-468b-93c7-6bfebf6578c4',
    dateAdded: new Date('2021-11-10T20:57:28.429Z'),
    notificationStatus: 'OPENED'
  }
]

module.exports = data;