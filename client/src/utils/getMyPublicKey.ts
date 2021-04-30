export const getMyPublicKey = (userId: string, members: Array<any>) => {
  const publicKey = members.find((user) => user.uuid === userId).publicKey;

  return publicKey;
};
