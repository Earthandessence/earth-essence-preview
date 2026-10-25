/* Earth & Essence: public Supabase browser auth only. No paid access is granted here. */
(()=>{'use strict';
const PROJECT_URL='https://nzlzuabqskoekrojlyrb.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_7cY6X5CN8h3AP3x1jAJdwg_cnYQ62Fo';
const $=id=>document.getElementById(id);
const msg=(message,error=false)=>{const node=$('auth-message');if(node){node.textContent=message;node.style.color=error?'#8d2b20':'#173c29'}};
const out=$('auth-signed-out'),inside=$('auth-signed-in');
if(!out||!inside)return;
if(!window.supabase||typeof window.supabase.createClient!=='function') {msg('Login service could not load. Check your internet connection and refresh.',true);return;}
const client=window.supabase.createClient(PROJECT_URL,PUBLISHABLE_KEY);
const site='https://earthandessence.github.io/earth-essence-preview/';
function render(user){out.hidden=!!user;inside.hidden=!user;$('auth-user-email').textContent=user?.email||'';}
const credentials=()=>({email:$('auth-email').value.trim(),password:$('auth-password').value});
const busy=flag=>['auth-signup','auth-signin','auth-reset','auth-signout'].forEach(id=>{$(id).disabled=flag});
async function perform(work){busy(true);msg('Please wait…');try{await work()}catch(e){msg(e?.message||'Something went wrong. Please try again.',true)}finally{busy(false)}}
$('auth-signup').addEventListener('click',()=>perform(async()=>{const {email,password}=credentials();if(!email||!password)throw Error('Enter your email and password first.');if(password.length<6)throw Error('Use a password of at least 6 characters.');const {data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:site}});if(error)throw error;msg(data.session?'Account created and signed in.':'Check your email for a confirmation link, then return here to sign in.')}));
$('auth-signin').addEventListener('click',()=>perform(async()=>{const {email,password}=credentials();if(!email||!password)throw Error('Enter your email and password first.');const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;msg('Signed in successfully. Paid content is not yet enabled.')}));
$('auth-reset').addEventListener('click',()=>perform(async()=>{const email=$('auth-email').value.trim();if(!email)throw Error('Enter your email address first.');const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:site});if(error)throw error;msg('If that email has an account, check your inbox for reset instructions.')}));
$('auth-signout').addEventListener('click',()=>perform(async()=>{const {error}=await client.auth.signOut();if(error)throw error;msg('Signed out.')}));
client.auth.onAuthStateChange((_event,session)=>render(session?.user||null));
client.auth.getUser().then(({data,error})=>{if(!error)render(data?.user||null)}).catch(()=>msg('Unable to check your sign-in status.',true));
})();
