"use client";
import { useState } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import signUp from "@/firebase/auth/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardCopy } from 'lucide-react';
import addUser from "@/firebase/firestore/addUser";
import getUser from "@/firebase/firestore/getUser";


const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    familyName: "",
    income: 0,
    familyId: "",
    admin: false,
  });

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.familyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function generateUID() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uid = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uid += characters[randomIndex];
    }
    setFormData((prevData) => ({
      ...prevData,
      ["familyId"]: uid,
    }));
    console.log(uid)
    // return uid;
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const { result, error } = await signUp(formData.email, formData.password);

    if (error) {
      return console.log(error);
    }

    // else successful
    console.log(result.user.uid);

    if (formData.admin){

      const { addFamilyresult, addFamilyerror } = await addUser(
        "family",
        formData.familyId,
        {familyName:formData.familyName}
      );

      const { addresult, adderror } = await addUser(
        "users",
        formData.phone,
        formData
      );
  
    }
    else {

      const getFamily = await getUser(
        "family",
        formData.familyId
      );
      console.log(getFamily.result.familyName)

      

      const { addresult, adderror } = await addUser(
        "users",
        formData.phone,
        {...formData,["familyName"]: getFamily.result.familyName, }
      );

    }

    
  
    // const { addresult, adderror } = await addUser('users', result.user.uid, data)
    // console.log(addresult)

    // if (adderror) {
    //   return console.log(adderror)
    // }

    return router.push("/login");
  };


  const test = async () => {const t = await getUser(
    "family",
    "03iPJ8"
  );
  console.log(t,"asd")}


  return (
    <Card className="mx-auto max-w-sm mt-16">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold" onClick={test}>Signup</CardTitle>
        <CardDescription>
          Please fill in the following details to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                required
              />
            </div>
          
            <div className="space-y-2">
              <Label htmlFor="income">Income</Label>
              <Input
                id="income"
                name="income"
                placeholder="Income"
                value={formData.income}
                onChange={handleChange}
                type="number"
                required
              />
            </div>

            <Tabs defaultValue="join" className="space-y-4">
          <TabsList>
            <TabsTrigger onClick={()=>setFormData((prevData) => ({
      ...prevData,
      ["admin"]: false,
    }))} value="join" className="capitalize">Join Family</TabsTrigger>
<TabsTrigger onClick={()=>setFormData((prevData) => ({
      ...prevData,
      ["admin"]: true,
    }))} value="create" className="capitalize">
              Create Family
            </TabsTrigger>
          </TabsList>
          <TabsContent value="join" className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="familyId">Family ID</Label>
              <Input
                id="familyId"
                name="familyId"
                placeholder="Family ID"
                value={formData.familyId}
                onChange={handleChange}
                required
              />
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                name="familyName"
                placeholder="Family Name"
                value={formData.familyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div htmlFor="familyId" className="flex justify-between w-full"><Label htmlFor="familyId">Family ID</Label> <Label  onClick={generateUID} className="text-blue-500 cursor-pointer">Generate Family ID</Label></div>
              <div className="relative">
              <div className="cursor-text border border-gray-200 rounded-md p-2" id="apiKey" onClick={undefined}>
         {formData.familyId||"Generate Id"}
        </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" onClick={copyToClipboard}>
        <ClipboardCopy />
        {copied && <span className="ml-2 text-green-500">Copied!</span>}
      </div>
    </div>  
            </div>
          </TabsContent>
        </Tabs>
            
            <Button className="w-full" type="submit">
              Signup
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
