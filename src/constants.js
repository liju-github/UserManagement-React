export const API_AUTH_URL = 'http://localhost:8080/api/auth';
export const API_USER_URL = "http://localhost:8080/api/user"
export const API_ADMIN_URL = "http://localhost:8080/api/admin"


export function getRandomAvatarURL() {
    const names = [
        "Adrian", "Liam", "Liliana", "Alexander", "Sarah", "Maria",
        "Sawyer", "Chase", "Mason", "Luis", "Eden", "Jack", "Caleb",
        "Leo", "Sara", "Sophia", "Jude", "Destiny", "Jameson", "Jocelyn"
    ]
    const randomName = names[Math.floor(Math.random() * names.length)];
    const avatarURL = `https://api.dicebear.com/9.x/shapes/svg?seed=${randomName}`;
    return avatarURL;
}