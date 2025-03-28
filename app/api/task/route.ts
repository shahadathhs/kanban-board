import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  const tasks = await Task.find();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const task = await Task.create(body);
  return NextResponse.json(task);
}

export async function DELETE(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { id } = body;
  const task = await Task.findByIdAndDelete(id);
  return NextResponse.json(task);
}

export async function PATCH(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { id } = body;
  const task = await Task.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(task);
}
