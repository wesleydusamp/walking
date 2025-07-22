export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("Código ausente");

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: `${process.env.REDIRECT_URI}`
  });

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    const tokenData = await tokenResponse.json();
    const userInfo = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userInfo.json();

    // Aqui você pode fazer o que quiser com o usuário, como adicionar ao servidor.
    return res.status(200).json({
      success: true,
      user: userData
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao autenticar", details: err });
  }
}
