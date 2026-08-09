export async function uploadTherapistDocuments(
  token,
  { profilePic, educationalDoc1, educationalDoc2, professionalDoc },
) {
  const formData = new FormData();
  formData.append("profilePic", profilePic);
  formData.append("educationalDoc1", educationalDoc1);
  formData.append("educationalDoc2", educationalDoc2);
  formData.append("professionalDoc", professionalDoc);

  const response = await fetch(
    "http://localhost:4000/api/upload/therapist-document",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  return response.ok;
}